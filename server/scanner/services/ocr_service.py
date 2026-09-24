import io
import logging
import os
import requests
from django.conf import settings
from PIL import Image
import pytesseract

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

def _configure_tesseract():
    tesseract_cmd = getattr(settings, 'TESSERACT_CMD', '')
    if tesseract_cmd and os.path.exists(tesseract_cmd):
        pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

def _extract_via_ocr_space(image_file):
    api_key = getattr(settings, 'OCR_API_KEY', 'helloworld')
    ocr_url = 'https://api.ocr.space/parse/image'

    try:
        image_file.seek(0)
        filename = getattr(image_file, 'name', 'image.jpg')
        content_type = getattr(image_file, 'content_type', 'image/jpeg')
        response = requests.post(
            ocr_url,
            files={'file': (filename, image_file.read(), content_type)},
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
        logger.error('OCR Space API request timed out.')
        raise OCRServiceError('Layanan OCR tidak merespons. Silakan coba lagi.')
    except requests.exceptions.RequestException as e:
        logger.error(f'OCR Space API request failed: {e}')
        raise OCRServiceError('Gagal menghubungi layanan OCR. Silakan coba lagi.')

    result = response.json()
    if result.get('IsErroredOnProcessing', False):
        error_msg = result.get('ErrorMessage', ['Unknown OCR error'])
        logger.error(f'OCR Space API processing error: {error_msg}')
        raise OCRServiceError(f'OCR gagal memproses gambar: {error_msg}')

    parsed_results = result.get('ParsedResults', [])
    if not parsed_results:
        raise OCRServiceError('OCR tidak menemukan teks dalam gambar. Pastikan gambar berisi teks yang jelas.')

    extracted_text = parsed_results[0].get('ParsedText', '').strip()
    if not extracted_text:
        raise OCRServiceError('OCR tidak menemukan teks dalam gambar. Pastikan gambar berisi teks yang jelas.')

    logger.info(f'OCR Space extracted {len(extracted_text)} characters from image.')
    return extracted_text

def extract_text_from_image(image_file):
    _validate_image(image_file)
    _configure_tesseract()

    try:
        image_file.seek(0)
        image = Image.open(io.BytesIO(image_file.read()))
        if image.mode not in ('L', 'RGB'):
            image = image.convert('RGB')

        try:
            extracted_text = pytesseract.image_to_string(image, lang='ind')
        except pytesseract.TesseractNotFoundError:
            raise
        except Exception:
            extracted_text = pytesseract.image_to_string(image)

        extracted_text = extracted_text.strip()
        if extracted_text:
            logger.info(f'Pytesseract extracted {len(extracted_text)} characters from image.')
            return extracted_text
    except pytesseract.TesseractNotFoundError:
        logger.warning('Tesseract OCR engine binary not found. Falling back to OCR Space API.')
    except Exception as e:
        logger.warning(f'Pytesseract extraction failed ({e}). Falling back to OCR Space API.')

    return _extract_via_ocr_space(image_file)
