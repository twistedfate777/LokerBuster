import io
import logging
import os
import requests
from django.conf import settings
from PIL import Image, UnidentifiedImageError
import pytesseract

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

class OCRServiceError(Exception):
    def __init__(self, message, code='ocr_processing_failed'):
        super().__init__(message)
        self.code = code

def _validate_image(image_file):
    filename = getattr(image_file, 'name', '')
    extension = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''

    if extension not in ALLOWED_EXTENSIONS:
        raise OCRServiceError(
            f'Format file tidak didukung: .{extension}. '
            f'Gunakan format: {", ".join(ALLOWED_EXTENSIONS)}.',
            code='unsupported_image_type',
        )

    if image_file.size > MAX_FILE_SIZE_BYTES:
        size_mb = image_file.size / (1024 * 1024)
        raise OCRServiceError(
            f'Ukuran file terlalu besar: {size_mb:.1f} MB. Maksimum 5 MB.',
            code='image_too_large',
        )


def _configure_tesseract():
    tesseract_cmd = getattr(settings, 'TESSERACT_CMD', '')
    if tesseract_cmd and os.path.exists(tesseract_cmd):
        pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

def _extract_via_ocr_space(image_file):
    api_key = getattr(settings, 'OCR_API_KEY', 'helloworld')
    if not api_key:
        raise OCRServiceError(
            'Neither local Tesseract nor OCR Space is available.',
            code='ocr_unavailable',
        )

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
        raise OCRServiceError(
            'Layanan OCR Space tidak merespons. Silakan coba lagi.',
            code='ocr_space_timeout',
        )
    except requests.exceptions.RequestException as e:
        logger.error(f'OCR Space API request failed: {e}')
        raise OCRServiceError(
            'Gagal menghubungi layanan OCR Space. Silakan coba lagi.',
            code='ocr_space_unavailable',
        )

    try:
        result = response.json()
    except ValueError as e:
        logger.error(f'OCR Space API returned invalid JSON: {e}')
        raise OCRServiceError(
            'Layanan OCR Space mengembalikan respons yang tidak valid.',
            code='ocr_space_processing_failed',
        )

    if not isinstance(result, dict):
        raise OCRServiceError(
            'Layanan OCR Space mengembalikan respons yang tidak valid.',
            code='ocr_space_processing_failed',
        )

    if result.get('IsErroredOnProcessing', False):
        error_msg = result.get('ErrorMessage', ['Unknown OCR error'])
        logger.error(f'OCR Space API processing error: {error_msg}')
        raise OCRServiceError(
            f'OCR Space gagal memproses gambar: {error_msg}',
            code='ocr_space_processing_failed',
        )

    parsed_results = result.get('ParsedResults', [])
    if not parsed_results:
        raise OCRServiceError(
            'OCR tidak menemukan teks dalam gambar. Pastikan gambar berisi teks yang jelas.',
            code='no_text_found',
        )

    extracted_text = parsed_results[0].get('ParsedText', '').strip()
    if not extracted_text:
        raise OCRServiceError(
            'OCR tidak menemukan teks dalam gambar. Pastikan gambar berisi teks yang jelas.',
            code='no_text_found',
        )

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
    except (UnidentifiedImageError, OSError) as e:
        logger.error(f'Failed to open image file: {e}')
        raise OCRServiceError('File gambar rusak atau tidak valid.', code='invalid_image')

    lang = getattr(settings, 'TESSERACT_LANG', 'ind+eng')

    try:
        try:
            extracted_text = pytesseract.image_to_string(image, lang=lang)
        except pytesseract.TesseractError as e:
            if 'ind' in lang:
                logger.warning(f'Tesseract language {lang} failed, falling back to eng: {e}')
                extracted_text = pytesseract.image_to_string(image, lang='eng')
            else:
                raise
    except pytesseract.TesseractNotFoundError as e:
        logger.warning(f'Tesseract OCR engine unavailable. Falling back to OCR Space: {e}')
    except Exception as e:
        logger.warning(f'Tesseract extraction failed. Falling back to OCR Space: {e}')
    else:
        extracted_text = extracted_text.strip()
        if extracted_text:
            logger.info(f'Tesseract extracted {len(extracted_text)} characters from image.')
            return extracted_text
        logger.info('Tesseract found no text. Falling back to OCR Space.')

    return _extract_via_ocr_space(image_file)
