from rest_framework import serializers
from .models import JobReport


class JobReportSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True, default=None)

    class Meta:
        model = JobReport
        fields = [
            'id',
            'user',
            'user_email',
            'source_type',
            'raw_text',
            'image_url',
            'company_name',
            'position',
            'scam_score',
            'confidence_level',
            'reason',
            'red_flags',
            'green_flags',
            'is_scam',
            'created_at',
        ]
        read_only_fields = fields


class AnalyzeTextInputSerializer(serializers.Serializer):
    text = serializers.CharField(
        min_length=20,
        max_length=10000,
        error_messages={
            'min_length': 'Teks terlalu pendek. Minimal 20 karakter untuk analisis yang akurat.',
            'max_length': 'Teks terlalu panjang. Maksimal 10.000 karakter.',
            'required': 'Field "text" wajib diisi jika tidak mengunggah gambar.',
            'blank': 'Teks tidak boleh kosong.',
        },
    )


class AnalyzeResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    data = JobReportSerializer()


class StatsResponseSerializer(serializers.Serializer):
    total_reports = serializers.IntegerField()
    total_scams_detected = serializers.IntegerField()
    average_scam_score = serializers.FloatField()
