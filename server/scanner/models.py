import uuid
from django.conf import settings
from django.db import models


class JobReport(models.Model):

    class SourceType(models.TextChoices):
        TEXT = 'text', 'Text Input'
        IMAGE = 'image', 'Image Upload'

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reports',
    )
    source_type = models.CharField(
        max_length=10,
        choices=SourceType.choices,
        default=SourceType.TEXT,
    )
    raw_text = models.TextField()
    image_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
    )
    company_name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    position = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    scam_score = models.PositiveSmallIntegerField(default=0)
    confidence_level = models.PositiveSmallIntegerField(default=0)
    reason = models.TextField(blank=True, default='')
    red_flags = models.JSONField(default=list, blank=True)
    green_flags = models.JSONField(default=list, blank=True)
    is_scam = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at'], name='idx_report_created'),
            models.Index(fields=['scam_score'], name='idx_report_score'),
            models.Index(fields=['company_name'], name='idx_report_company'),
            models.Index(fields=['is_scam'], name='idx_report_is_scam'),
        ]
        verbose_name = 'Job Report'
        verbose_name_plural = 'Job Reports'

    def save(self, *args, **kwargs):
        self.is_scam = self.scam_score >= 60
        super().save(*args, **kwargs)

    def __str__(self):
        label = 'SCAM' if self.is_scam else 'SAFE'
        company = self.company_name or 'Unknown'
        return f'[{label}] {company} — score {self.scam_score} ({self.created_at:%Y-%m-%d})'
