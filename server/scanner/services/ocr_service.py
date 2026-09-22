import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024


class OCRServiceError(Exception):
    pass


def _validate_image(image_file):
    filename = getattr(image_file, 'name', '')
    extension = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''

    if extension not in ALLOWED_EXTENSIONS:
        raise OCRServiceError(
            f'Format file tidak didukung: .{extension}. '
            f'Gunakan format: {", ".join(ALLOWED_EXTENSIONS)}.'
        )

    if image_file.size > MAX_FILE_SIZE_BYTES:
        size_mb = image_file.size / (1024 * 1024)
        raise OCRServiceError(f'Ukuran file terlalu besar: {size_mb:.1f} MB. Maksimum 5 MB.')


def extract_text_from_image(image_file):
    _validate_image(image_file)

    api_key = getattr(settings, 'OCR_API_KEY', 'helloworld')
    ocr_url = 'https://api.ocr.space/parse/image'

    try:
        image_file.seek(0)
        response = requests.post(
            ocr_url,
            files={'file': (image_file.name, image_file.read(), image_file.content_type)},
            data={
                'apikey': api_key,
                'language': 'eng',
                'isOverlayRequired': 'false',
                'detectOrientation': 'true',
                'scale': 'true',
                'OCREngine': '2',
            },
            timeout=30,
        )
        response.raise_for_status()
    except requests.exceptions.Timeout:
        logger.error('OCR API request timed out.')
        raise OCRServiceError('Layanan OCR tidak merespons. Silakan coba lagi.')
    except requests.exceptions.RequestException as e:
        logger.error(f'OCR API request failed: {e}')
        raise OCRServiceError('Gagal menghubungi layanan OCR. Silakan coba lagi.')

    result = response.json()

    if result.get('IsErroredOnProcessing', False):
        error_msg = result.get('ErrorMessage', ['Unknown OCR error'])
        logger.error(f'OCR API processing error: {error_msg}')
        raise OCRServiceError(f'OCR gagal memproses gambar: {error_msg}')

    parsed_results = result.get('ParsedResults', [])
    if not parsed_results:
        raise OCRServiceError('OCR tidak menemukan teks dalam gambar. Pastikan gambar berisi teks yang jelas.')

    extracted_text = parsed_results[0].get('ParsedText', '').strip()

    if not extracted_text:
        raise OCRServiceError('OCR tidak menemukan teks dalam gambar. Pastikan gambar berisi teks yang jelas.')

    logger.info(f'OCR extracted {len(extracted_text)} characters from image.')
    return extracted_text
