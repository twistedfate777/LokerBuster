import json
import logging
import re
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

GROQ_MODEL = 'openai/gpt-oss-120b'
GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
MAX_RETRIES = 2
REQUEST_TIMEOUT = 60

SYSTEM_PROMPT = """Kamu adalah seorang ahli investigasi penipuan rekrutmen kerja di Indonesia. Tugasmu adalah menganalisis teks lowongan kerja dan menentukan apakah lowongan tersebut merupakan penipuan atau bukan.

PENTING — SUMBER INPUT:
Teks yang kamu terima mungkin hasil OCR dari gambar poster lowongan kerja. Hasil OCR sering mengandung noise seperti:
- Angka atau teks dari elemen dekoratif (grafik latar belakang, watermark, chart, stock ticker)
- Teks dari UI screenshot (tombol, menu bar, tab browser)
- Karakter acak dari desain grafis
ABAIKAN semua noise tersebut. Fokus HANYA pada konten lowongan kerja yang sebenarnya.

JIKA INPUT BUKAN LOWONGAN KERJA (misalnya gambar acak, teks tidak relevan, atau tidak ada konten lowongan yang bisa dianalisis), gunakan nilai berikut:
{"is_valid_job_posting": false, "scam_score": 0, "confidence_level": 0, "reason": "Input tidak mengandung informasi lowongan kerja yang dapat dianalisis.", "company_name": null, "position": null, "red_flags": [], "green_flags": []}

ATURAN ANALISIS:
1. Tanda-tanda PENIPUAN (meningkatkan scam_score):
   - Meminta uang di muka (biaya pendaftaran, biaya seragam, biaya training, dll.)
   - Gaji tidak realistis atau terlalu tinggi untuk posisi entry-level
   - Tidak menyebutkan nama perusahaan yang jelas atau menggunakan nama perusahaan palsu
   - Menggunakan nomor WhatsApp pribadi sebagai kontak resmi (bukan email perusahaan)
   - Tidak ada alamat kantor yang jelas
   - Proses rekrutmen yang terlalu mudah (langsung diterima tanpa seleksi)
   - Menggunakan bahasa yang terlalu menjanjikan atau mendesak
   - Meminta data pribadi sensitif di awal (KTP, rekening bank)

2. Tanda-tanda AMAN (menurunkan scam_score):
   - Menggunakan email perusahaan resmi (domain perusahaan, bukan gmail/yahoo pribadi)
   - Menyebutkan nama perusahaan yang jelas dan bisa diverifikasi
   - Jobdesk dan kualifikasi terperinci dan realistis
   - Tidak meminta uang atau data sensitif
   - Memiliki website resmi perusahaan
   - Alamat kantor jelas dan bisa diverifikasi

3. Berikan skor berdasarkan jumlah dan tingkat keparahan indikator yang ditemukan.
4. PASTIKAN scam_score KONSISTEN dengan reason dan flags. Jika lebih banyak green_flags dan sedikit/tidak ada red_flags, scam_score HARUS rendah (0-30). Jika banyak red_flags, scam_score HARUS tinggi (70-100).

KAMU WAJIB MEMBALAS HANYA DALAM FORMAT JSON BERIKUT, TANPA TEKS TAMBAHAN:
{"is_valid_job_posting": <boolean>, "scam_score": <integer 0-100>, "confidence_level": <integer 0-100>, "reason": "<penjelasan umum dalam Bahasa Indonesia>", "company_name": "<string atau null>", "position": "<string posisi/jabatan yang ditawarkan atau null>", "red_flags": ["<string flag 1>", "<string flag 2>"], "green_flags": ["<string flag 1>", "<string flag 2>"]}

JANGAN menambahkan teks apapun di luar JSON. JANGAN gunakan markdown code block. Hanya JSON murni."""


class AIServiceError(Exception):
    pass


class InvalidJobPostingError(AIServiceError):
    pass


def _extract_json_from_response(text):
    cleaned = text.strip()

    if cleaned.startswith('```'):
        lines = cleaned.split('\n')
        lines = [l for l in lines if not l.strip().startswith('```')]
        cleaned = '\n'.join(lines).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
    matches = re.findall(pattern, cleaned, re.DOTALL)
    for match in matches:
        try:
            return json.loads(match)
        except json.JSONDecodeError:
            continue

    raise AIServiceError('AI mengembalikan respons yang tidak valid. Silakan coba lagi.')


def _validate_ai_result(result):
    if not result.get('is_valid_job_posting', True):
        raise InvalidJobPostingError(
            result.get('reason', 'Input tidak mengandung informasi lowongan kerja yang dapat dianalisis.')
        )

    required_fields = ['scam_score', 'confidence_level', 'reason']
    for field in required_fields:
        if field not in result:
            raise AIServiceError(f'Respons AI tidak lengkap: field "{field}" tidak ditemukan.')

    result['scam_score'] = max(0, min(100, int(result['scam_score'])))
    result['confidence_level'] = max(0, min(100, int(result['confidence_level'])))
    result['reason'] = str(result.get('reason', ''))
    result['company_name'] = result.get('company_name') or None
    result['position'] = result.get('position') or None
    result['red_flags'] = result.get('red_flags') or []
    result['green_flags'] = result.get('green_flags') or []

    if not isinstance(result['red_flags'], list):
        result['red_flags'] = []
    if not isinstance(result['green_flags'], list):
        result['green_flags'] = []

    return result


def analyze_with_groq(text_input):
    api_key = getattr(settings, 'GROQ_API_KEY', '')
    if not api_key:
        raise AIServiceError('GROQ_API_KEY belum dikonfigurasi di settings/environment.')

    payload = {
        'model': GROQ_MODEL,
        'messages': [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': f'Analisis lowongan kerja berikut:\n\n{text_input}'},
        ],
        'temperature': 0.1,
        'max_tokens': 1024,
    }

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}',
    }

    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            logger.info(f'Groq request attempt {attempt}/{MAX_RETRIES}')
            response = requests.post(
                GROQ_API_URL,
                json=payload,
                timeout=REQUEST_TIMEOUT,
                headers=headers,
            )
            response.raise_for_status()
        except requests.exceptions.ConnectionError:
            last_error = AIServiceError('Tidak dapat terhubung ke Groq API.')
            logger.error(f'Groq connection failed (attempt {attempt})')
            continue
        except requests.exceptions.Timeout:
            last_error = AIServiceError('Groq API tidak merespons dalam waktu yang ditentukan.')
            logger.error(f'Groq request timed out (attempt {attempt})')
            continue
        except requests.exceptions.RequestException as e:
            body = getattr(e.response, 'text', '') if hasattr(e, 'response') else ''
            last_error = AIServiceError(f'Gagal menghubungi Groq API: {e}')
            logger.error(f'Groq request error (attempt {attempt}): {e} | body: {body[:300]}')
            continue

        try:
            response_data = response.json()
            raw_response = response_data['choices'][0]['message']['content']
            logger.debug(f'Groq raw response: {raw_response[:500]}')

            result = _extract_json_from_response(raw_response)
            validated = _validate_ai_result(result)

            logger.info(
                f'Analysis complete — scam_score={validated["scam_score"]}, '
                f'confidence={validated["confidence_level"]}'
            )
            return validated

        except InvalidJobPostingError:
            raise
        except (json.JSONDecodeError, KeyError, ValueError, TypeError, IndexError) as e:
            last_error = AIServiceError(
                'AI mengembalikan respons yang tidak dapat diproses. Silakan coba lagi.'
            )
            logger.error(f'Failed to parse Groq response (attempt {attempt}): {e}')
            continue

    raise last_error
