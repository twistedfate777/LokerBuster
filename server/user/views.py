from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import RegisterSerializer, UserSerializer

def _success(data, code=status.HTTP_200_OK):
    return Response({'success': True, 'data': data}, status=code)

def _error(message, code=status.HTTP_400_BAD_REQUEST, errors=None):
    payload = {'success': False, 'error': {'message': message}}
    if errors:
        payload['error']['details'] = errors
    return Response(payload, status=code)

def _set_token_cookies(response, request, access_token, refresh_token=None):
    secure = request.is_secure()
    cookie_params = {
        'httponly': True,
        'secure': secure,
        'samesite': 'None' if secure else 'Lax',
        'path': '/',
    }
    response.set_cookie(
        'access_token',
        str(access_token),
        max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
        **cookie_params,
    )
    if refresh_token:
        response.set_cookie(
            'refresh_token',
            str(refresh_token),
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
            **cookie_params,
        )
    return response

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()))[0]
            return _error(
                str(first_error),
                status.HTTP_400_BAD_REQUEST,
                errors=serializer.errors,
            )

        user = serializer.save()
        tokens = RefreshToken.for_user(user)

        response = _success(UserSerializer(user).data, status.HTTP_201_CREATED)
        return _set_token_cookies(response, request, tokens.access_token, tokens)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        from django.contrib.auth import authenticate

        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return _error('Email dan password wajib diisi.')

        user = authenticate(request, username=email, password=password)
        if user is None:
            return _error('Email atau password salah.', status.HTTP_401_UNAUTHORIZED)

        tokens = RefreshToken.for_user(user)

        response = _success(UserSerializer(user).data)
        return _set_token_cookies(response, request, tokens.access_token, tokens)

class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        raw_refresh = request.COOKIES.get('refresh_token')
        if not raw_refresh:
            return _error('Refresh token tidak ditemukan.', status.HTTP_401_UNAUTHORIZED)

        try:
            old_token = RefreshToken(raw_refresh)
            new_access = old_token.access_token
            new_refresh = None

            if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS', False):
                from django.contrib.auth import get_user_model
                User = get_user_model()
                user_id = old_token.payload.get('user_id')
                user = User.objects.get(id=user_id)
                new_refresh = RefreshToken.for_user(user)

        except TokenError:
            return _error('Refresh token tidak valid atau sudah kadaluarsa.', status.HTTP_401_UNAUTHORIZED)

        response = _success({'refreshed': True})
        return _set_token_cookies(response, request, new_access, new_refresh)

class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = _success({'logged_out': True})
        secure = request.is_secure()
        cookie_params = {
            'path': '/',
            'secure': secure,
            'samesite': 'None' if secure else 'Lax',
        }
        response.set_cookie('access_token', '', max_age=0, expires='Thu, 01 Jan 1970 00:00:00 GMT', **cookie_params)
        response.set_cookie('refresh_token', '', max_age=0, expires='Thu, 01 Jan 1970 00:00:00 GMT', **cookie_params)
        return response


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return _success(UserSerializer(request.user).data)
