import uuid
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from unittest.mock import patch
from .models import JobReport


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


class CommunityLedgerViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('scanner:community-ledger')

        for i in range(5):
            JobReport.objects.create(
                raw_text=f'Report #{i}',
                scam_score=80,
                confidence_level=90,
                reason='Test',
            )
        for i in range(3):
            JobReport.objects.create(
                raw_text=f'Safe report #{i}',
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
