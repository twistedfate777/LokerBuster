import logging
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
    if tesseract_cmd:
        pytesseract.pytesseract.tesseract_cmd = tesseract_cmd


def extract_text_from_image(image_file):
    _validate_image(image_file)
    _configure_tesseract()

    try:
        image_file.seek(0)
        image = Image.open(image_file)
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
    except pytesseract.TesseractNotFoundError:
        logger.error('Tesseract OCR engine binary not found.')
        raise OCRServiceError('Layanan OCR tidak tersedia pada sistem.', code='ocr_unavailable')
    except pytesseract.TesseractError as e:
        logger.error(f'Tesseract OCR processing error: {e}')
        raise OCRServiceError('OCR gagal memproses gambar.', code='ocr_processing_failed')

    extracted_text = extracted_text.strip()
    if not extracted_text:
        raise OCRServiceError(
            'OCR tidak menemukan teks dalam gambar. Pastikan gambar berisi teks yang jelas.',
            code='no_text_found',
        )

    logger.info(f'OCR extracted {len(extracted_text)} characters from image.')
    return extracted_text
