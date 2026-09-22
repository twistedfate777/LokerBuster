from django.contrib import admin
from .models import JobReport


@admin.register(JobReport)
class JobReportAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'company_name',
        'source_type',
        'scam_score',
        'confidence_level',
        'is_scam',
        'created_at',
    )
    list_filter = ('is_scam', 'source_type', 'created_at')
    search_fields = ('company_name', 'raw_text', 'reason')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    list_per_page = 30
