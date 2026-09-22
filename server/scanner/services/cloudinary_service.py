import logging
import cloudinary
import cloudinary.uploader
from django.conf import settings

logger = logging.getLogger(__name__)


class CloudinaryServiceError(Exception):
    pass


def _configure_cloudinary():
    cloudinary.config(
        cloud_name=getattr(settings, 'CLOUDINARY_CLOUD_NAME', ''),
        api_key=getattr(settings, 'CLOUDINARY_API_KEY', ''),
        api_secret=getattr(settings, 'CLOUDINARY_API_SECRET', ''),
        secure=True,
    )


def upload_image(image_file):
    _configure_cloudinary()

    try:
        image_file.seek(0)
        result = cloudinary.uploader.upload(
            image_file,
            folder='lokerbuster/scans',
            resource_type='image',
            allowed_formats=['jpg', 'jpeg', 'png'],
            transformation=[
                {'quality': 'auto:good', 'fetch_format': 'auto'},
            ],
        )
        secure_url = result.get('secure_url', '')
        if not secure_url:
            raise CloudinaryServiceError(
                'Cloudinary mengembalikan respons tanpa URL. Silakan coba lagi.'
            )

        logger.info(f'Image uploaded to Cloudinary: {secure_url}')
        return secure_url

    except cloudinary.exceptions.Error as e:
        logger.error(f'Cloudinary upload failed: {e}')
        raise CloudinaryServiceError(f'Gagal mengunggah gambar ke penyimpanan cloud: {e}')
    except Exception as e:
        logger.error(f'Unexpected error during Cloudinary upload: {e}')
        raise CloudinaryServiceError('Terjadi kesalahan saat mengunggah gambar. Silakan coba lagi.')
