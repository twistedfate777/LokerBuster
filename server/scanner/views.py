import logging
from django.db.models import Avg, Count, Q
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import JobReport
from .serializers import AnalyzeTextInputSerializer, JobReportSerializer
from .services import analyze_with_groq, extract_text_from_image, upload_image
from .services.ocr_service import OCRServiceError
from .services.ai_service import AIServiceError, InvalidJobPostingError
from .services.cloudinary_service import CloudinaryServiceError

logger = logging.getLogger(__name__)

def _success(data, code=status.HTTP_200_OK):
    return Response({'success': True, 'data': data}, status=code)


def _error(message, code=status.HTTP_400_BAD_REQUEST, errors=None, error_code=None):
    payload = {'success': False, 'error': {'message': message}}
    if error_code:
        payload['error']['code'] = error_code
    if errors:
        payload['error']['details'] = errors
    return Response(payload, status=code)


class AnalyzeView(APIView):
    parser_classes = [JSONParser, MultiPartParser]
    permission_classes = [AllowAny]

    def post(self, request):
        image_file = request.FILES.get('image')
        raw_text = None
        source_type = 'text'
        image_url = None

        if image_file:
            source_type = 'image'
            try:
                raw_text = extract_text_from_image(image_file)
            except OCRServiceError as e:
                return _error(
                    str(e),
                    status.HTTP_422_UNPROCESSABLE_ENTITY,
                    error_code=e.code,
                )

            try:
                image_url = upload_image(image_file)
            except CloudinaryServiceError as e:
                logger.warning(f'Cloudinary upload failed: {e}')
                image_url = None
        else:
            serializer = AnalyzeTextInputSerializer(data=request.data)
            if not serializer.is_valid():
                first_error = next(iter(serializer.errors.values()))[0]
                return _error(
                    str(first_error),
                    status.HTTP_400_BAD_REQUEST,
                    errors=serializer.errors,
                )
            raw_text = serializer.validated_data['text']

        try:
            ai_result = analyze_with_groq(raw_text)
        except InvalidJobPostingError as e:
            return _error(
                str(e),
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                error_code='not_job_posting',
            )
        except AIServiceError as e:
            return _error(
                str(e),
                status.HTTP_502_BAD_GATEWAY,
                error_code=e.code,
            )

        user = request.user if request.user.is_authenticated else None

        report = JobReport.objects.create(
            user=user,
            source_type=source_type,
            raw_text=raw_text,
            image_url=image_url,
            company_name=ai_result.get('company_name'),
            position=ai_result.get('position'),
            scam_score=ai_result['scam_score'],
            confidence_level=ai_result['confidence_level'],
            reason=ai_result['reason'],
            red_flags=ai_result.get('red_flags', []),
            green_flags=ai_result.get('green_flags', []),
        )

        return _success(JobReportSerializer(report).data, status.HTTP_201_CREATED)


class LedgerPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 50


class CommunityLedgerView(ListAPIView):
    serializer_class = JobReportSerializer
    pagination_class = LedgerPagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        show_all = self.request.query_params.get('all', 'false').lower() == 'true'
        qs = JobReport.objects.select_related('user').all()
        if not show_all:
            qs = qs.filter(is_scam=True)
        return qs


class StatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        aggregates = JobReport.objects.aggregate(
            total_reports=Count('id'),
            total_scams_detected=Count('id', filter=Q(is_scam=True)),
            average_scam_score=Avg('scam_score'),
        )
        aggregates['average_scam_score'] = round(
            aggregates['average_scam_score'] or 0, 1
        )
        return _success(aggregates)


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from django.utils import timezone
        from .services.health_service import (
            check_database_health,
            check_ocr_health,
            check_llm_health,
        )

        db_health = check_database_health()
        ocr_health = check_ocr_health()
        llm_health = check_llm_health()

        services = {
            'database': db_health,
            'ocr': ocr_health,
            'extractor': llm_health,
        }

        all_healthy = all(s.get('status') == 'healthy' for s in services.values())
        overall_status = 'healthy' if all_healthy else 'degraded'

        payload = {
            'success': all_healthy,
            'status': overall_status,
            'timestamp': timezone.now().isoformat(),
            'services': services,
        }

        http_code = (
            status.HTTP_200_OK
            if all_healthy
            else status.HTTP_503_SERVICE_UNAVAILABLE
        )
        return Response(payload, status=http_code)

