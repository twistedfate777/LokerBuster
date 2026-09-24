import uuid
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from PIL import Image
import pytesseract
from rest_framework.test import APIClient
from unittest.mock import patch
from .models import JobReport
from .services.ai_service import AIServiceError, InvalidJobPostingError
from .services.ocr_service import extract_text_from_image, OCRServiceError


class JobReportModelTest(TestCase):

    def test_create_report_has_uuid_pk(self):
        report = JobReport.objects.create(
            source_type='text',
            raw_text='Lowongan kerja PT Maju Jaya sebagai Staff Admin.',
            scam_score=20,
            confidence_level=80,
            reason='Lowongan terlihat aman.',
        )
        self.assertIsInstance(report.id, uuid.UUID)

    def test_create_report_safe(self):
        report = JobReport.objects.create(
            source_type='text',
            raw_text='Lowongan kerja PT Maju Jaya sebagai Staff Admin.',
            scam_score=20,
            confidence_level=80,
            reason='Lowongan terlihat aman.',
        )
        self.assertFalse(report.is_scam)
        self.assertIn('SAFE', str(report))

    def test_create_report_scam(self):
        report = JobReport.objects.create(
            source_type='text',
            raw_text='Kirim uang 500rb untuk biaya seragam.',
            scam_score=90,
            confidence_level=95,
            reason='Meminta biaya di muka.',
            company_name='PT Abal-Abal',
        )
        self.assertTrue(report.is_scam)
        self.assertIn('SCAM', str(report))

    def test_is_scam_auto_set_on_save(self):
        report = JobReport(scam_score=70)
        report.raw_text = 'test'
        report.save()
        self.assertTrue(report.is_scam)

        report.scam_score = 69
        report.save()
        self.assertFalse(report.is_scam)

    def test_image_url_field(self):
        report = JobReport.objects.create(
            source_type='image',
            raw_text='Extracted OCR text here.',
            image_url='https://res.cloudinary.com/test/image/upload/v1/lokerbuster/scans/test.jpg',
            scam_score=50,
            confidence_level=70,
            reason='Perlu analisis lebih lanjut.',
        )
        self.assertEqual(report.image_url, 'https://res.cloudinary.com/test/image/upload/v1/lokerbuster/scans/test.jpg')


class AnalyzeTextInputSerializerTest(TestCase):

    def test_text_too_short(self):
        from .serializers import AnalyzeTextInputSerializer
        ser = AnalyzeTextInputSerializer(data={'text': 'short'})
        self.assertFalse(ser.is_valid())
        self.assertIn('text', ser.errors)

    def test_valid_text(self):
        from .serializers import AnalyzeTextInputSerializer
        ser = AnalyzeTextInputSerializer(data={'text': 'A' * 25})
        self.assertTrue(ser.is_valid())


class OCRServiceTest(TestCase):

    def _create_mock_image(self, name='test.jpg', size=(100, 100), color='white', format='JPEG'):
        file_obj = BytesIO()
        image = Image.new('RGB', size, color=color)
        image.save(file_obj, format=format)
        file_obj.seek(0)
        return SimpleUploadedFile(name, file_obj.read(), content_type=f'image/{format.lower()}')

    def test_unsupported_file_extension(self):
        invalid_file = SimpleUploadedFile('document.pdf', b'sample content', content_type='application/pdf')
        with self.assertRaises(OCRServiceError):
            extract_text_from_image(invalid_file)

    @patch('pytesseract.image_to_string')
    def test_successful_ocr_extraction(self, mock_image_to_string):
        mock_image_to_string.return_value = 'Lowongan Kerja PT Sukses Makmur'
        image_file = self._create_mock_image()
        result = extract_text_from_image(image_file)
        self.assertEqual(result, 'Lowongan Kerja PT Sukses Makmur')

    @patch('pytesseract.image_to_string')
    def test_empty_ocr_text_raises_error(self, mock_image_to_string):
        mock_image_to_string.return_value = '   \n  '
        image_file = self._create_mock_image()
        with self.assertRaises(OCRServiceError):
            extract_text_from_image(image_file)

    @patch('pytesseract.image_to_string')
    def test_tesseract_not_found_raises_error(self, mock_image_to_string):
        mock_image_to_string.side_effect = pytesseract.TesseractNotFoundError()
        image_file = self._create_mock_image()
        with self.assertRaises(OCRServiceError):
            extract_text_from_image(image_file)


class AnalyzeViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('scanner:analyze')

    def test_missing_text_and_image(self):
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.json()['success'])

    @patch('scanner.views.analyze_with_groq')
    def test_successful_text_analysis(self, mock_groq):
        mock_groq.return_value = {
            'scam_score': 85,
            'confidence_level': 90,
            'reason': 'Meminta biaya pendaftaran.',
            'company_name': 'PT Scam Corp',
        }
        response = self.client.post(
            self.url,
            {'text': 'Kirim uang Rp 500.000 untuk biaya pendaftaran ke rekening pribadi.'},
            format='json',
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['scam_score'], 85)
        self.assertIsNone(data['data']['user'])
        self.assertEqual(JobReport.objects.count(), 1)

    @patch('scanner.views.analyze_with_groq')
    def test_analysis_response_has_uuid_id(self, mock_groq):
        mock_groq.return_value = {
            'scam_score': 40,
            'confidence_level': 75,
            'reason': 'Lowongan terlihat normal.',
            'company_name': 'PT Aman Sentosa',
        }
        response = self.client.post(
            self.url,
            {'text': 'Lowongan kerja staff admin di PT Aman Sentosa, Jl. Sudirman No. 1.'},
            format='json',
        )
        report_id = response.json()['data']['id']
        parsed_uuid = uuid.UUID(report_id)
        self.assertEqual(str(parsed_uuid), report_id)

    @patch('scanner.views.upload_image')
    @patch('scanner.views.analyze_with_groq')
    @patch('scanner.views.extract_text_from_image')
    def test_successful_image_analysis(self, mock_extract, mock_groq, mock_upload):
        mock_extract.return_value = 'Lowongan Kerja Admin PT Maju Mundur'
        mock_upload.return_value = 'https://res.cloudinary.com/test/image.jpg'
        mock_groq.return_value = {
            'scam_score': 15,
            'confidence_level': 85,
            'reason': 'Lowongan valid.',
            'company_name': 'PT Maju Mundur',
        }
        image_file = SimpleUploadedFile('poster.png', b'fake image data', content_type='image/png')
        response = self.client.post(
            self.url,
            {'image': image_file},
            format='multipart',
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['source_type'], 'image')
        self.assertEqual(data['data']['image_url'], 'https://res.cloudinary.com/test/image.jpg')

    @patch('scanner.views.upload_image')
    @patch('scanner.views.analyze_with_groq')
    @patch('scanner.views.extract_text_from_image')
    def test_non_job_image_returns_specific_error_code(self, mock_extract, mock_groq, mock_upload):
        mock_extract.return_value = 'A photo without any job listing details.'
        mock_upload.return_value = 'https://res.cloudinary.com/test/image.jpg'
        mock_groq.side_effect = InvalidJobPostingError(
            'Input tidak mengandung informasi lowongan kerja yang dapat dianalisis.'
        )
        image_file = SimpleUploadedFile('photo.png', b'fake image data', content_type='image/png')

        response = self.client.post(self.url, {'image': image_file}, format='multipart')

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.json()['error']['code'], 'not_job_posting')

    @patch('scanner.views.analyze_with_groq')
    def test_extractor_connection_error_returns_specific_error_code(self, mock_groq):
        mock_groq.side_effect = AIServiceError(
            'Tidak dapat terhubung ke Groq API.',
            code='extractor_connection_failed',
        )

        response = self.client.post(
            self.url,
            {'text': 'Lowongan kerja staff admin pada perusahaan lokal.'},
            format='json',
        )

        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.json()['error']['code'], 'extractor_connection_failed')

    @patch('scanner.views.extract_text_from_image')
    def test_ocr_unavailable_returns_specific_error_code(self, mock_extract):
        mock_extract.side_effect = OCRServiceError(
            'Layanan OCR tidak tersedia pada sistem.',
            code='ocr_unavailable',
        )
        image_file = SimpleUploadedFile('poster.png', b'fake image data', content_type='image/png')

        response = self.client.post(self.url, {'image': image_file}, format='multipart')

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.json()['error']['code'], 'ocr_unavailable')


class CommunityLedgerViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('scanner:community-ledger')

        for i in range(5):
            JobReport.objects.create(
                raw_text=f'Report {i}',
                scam_score=80,
                confidence_level=90,
                reason='Test',
            )
        for i in range(3):
            JobReport.objects.create(
                raw_text=f'Safe report {i}',
                scam_score=30,
                confidence_level=90,
                reason='Safe test',
            )

    def test_default_only_scams(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 5)

    def test_all_reports(self):
        response = self.client.get(self.url, {'all': 'true'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 8)


class StatsViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('scanner:stats')

    def test_empty_stats(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        data = response.json()['data']
        self.assertEqual(data['total_reports'], 0)
        self.assertEqual(data['total_scams_detected'], 0)


class HealthCheckViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('scanner:health')

    @patch('scanner.services.health_service.requests.get')
    @patch('scanner.services.health_service.pytesseract.get_languages')
    @patch('scanner.services.health_service.pytesseract.get_tesseract_version')
    @patch('scanner.services.health_service.connection.ensure_connection')
    def test_health_check_all_healthy(self, mock_db, mock_tess_version, mock_tess_lang, mock_groq):
        mock_db.return_value = None
        mock_tess_version.return_value = '5.3.4'
        mock_tess_lang.return_value = ['eng', 'ind']
        mock_groq.return_value.status_code = 200

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['status'], 'healthy')
        self.assertEqual(data['services']['database']['status'], 'healthy')
        self.assertEqual(data['services']['ocr']['status'], 'healthy')
        self.assertEqual(data['services']['extractor']['status'], 'healthy')

    @patch('scanner.services.health_service.requests.get')
    @patch('scanner.services.health_service.pytesseract.get_tesseract_version')
    @patch('scanner.services.health_service.connection.ensure_connection')
    def test_health_check_ocr_unhealthy(self, mock_db, mock_tess_version, mock_groq):
        mock_db.return_value = None
        mock_tess_version.side_effect = pytesseract.TesseractNotFoundError()
        mock_groq.return_value.status_code = 200

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 503)
        data = response.json()
        self.assertFalse(data['success'])
        self.assertEqual(data['status'], 'degraded')
        self.assertEqual(data['services']['ocr']['status'], 'unhealthy')
        self.assertEqual(data['services']['database']['status'], 'healthy')

    @patch('scanner.services.health_service.connection.ensure_connection')
    def test_health_check_db_unhealthy(self, mock_db):
        mock_db.side_effect = Exception('Database connection refused')

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 503)
        data = response.json()
        self.assertFalse(data['success'])
        self.assertEqual(data['status'], 'degraded')
        self.assertEqual(data['services']['database']['status'], 'unhealthy')

