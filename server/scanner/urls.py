from django.urls import path
from .views import AnalyzeView, CommunityLedgerView, HealthCheckView, StatsView

app_name = 'scanner'

urlpatterns = [
    path('analyze/', AnalyzeView.as_view(), name='analyze'),
    path('health/', HealthCheckView.as_view(), name='health'),
    path('reports/', CommunityLedgerView.as_view(), name='community-ledger'),
    path('stats/', StatsView.as_view(), name='stats'),
]
