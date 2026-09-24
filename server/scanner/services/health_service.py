import time
import requests
from django.conf import settings
from django.db import connection
import pytesseract
from .ocr_service import _configure_tesseract


def check_database_health():
    start = time.perf_counter()
    try:
        connection.ensure_connection()
        latency = round((time.perf_counter() - start) * 1000, 2)
        return {
            'status': 'healthy',
            'vendor': connection.vendor,
            'latency_ms': latency,
        }
    except Exception as e:
        return {
            'status': 'unhealthy',
            'error': str(e),
        }


def check_ocr_health():
    _configure_tesseract()
    start = time.perf_counter()
    try:
        version = str(pytesseract.get_tesseract_version())
        try:
            languages = pytesseract.get_languages(config='')
        except Exception:
            languages = []

        latency = round((time.perf_counter() - start) * 1000, 2)
        return {
            'status': 'healthy',
            'version': version,
            'languages': languages,
            'latency_ms': latency,
        }
    except pytesseract.TesseractNotFoundError:
        return {
            'status': 'unhealthy',
            'error': 'Tesseract OCR binary not found on host system.',
        }
    except Exception as e:
        return {
            'status': 'unhealthy',
            'error': str(e),
        }


def check_llm_health():
    api_key = getattr(settings, 'GROQ_API_KEY', '')
    if not api_key:
        return {
            'status': 'unhealthy',
            'error': 'GROQ_API_KEY is not configured.',
        }

    model = getattr(settings, 'GROQ_MODEL', 'llama-3.1-8b-instant')
    start = time.perf_counter()
    try:
        response = requests.get(
            'https://api.groq.com/openai/v1/models',
            headers={'Authorization': f'Bearer {api_key}'},
            timeout=10,
        )
        latency = round((time.perf_counter() - start) * 1000, 2)
        if response.status_code == 200:
            return {
                'status': 'healthy',
                'model': model,
                'latency_ms': latency,
            }
        return {
            'status': 'unhealthy',
            'error': f'Groq API returned HTTP {response.status_code}',
            'latency_ms': latency,
        }
    except requests.exceptions.Timeout:
        return {
            'status': 'unhealthy',
            'error': 'Groq API request timed out.',
        }
    except requests.exceptions.RequestException as e:
        return {
            'status': 'unhealthy',
            'error': str(e),
        }
