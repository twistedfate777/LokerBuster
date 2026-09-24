from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from scanner.views import HealthCheckView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', HealthCheckView.as_view(), name='health-root'),
    path('api/', include('scanner.urls')),
    path('api/auth/', include('user.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
