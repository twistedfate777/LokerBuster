import uuid
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

User = get_user_model()

class UserModelTest(TestCase):
    def test_create_user_with_uuid_pk(self):
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='securepass123',
        )
        self.assertIsInstance(user.id, uuid.UUID)
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('securepass123'))

    def test_email_is_unique(self):
        User.objects.create_user(
            email='dup@example.com',
            username='user1',
            password='password123',
        )
        with self.assertRaises(Exception):
            User.objects.create_user(
                email='dup@example.com',
                username='user2',
                password='password456',
            )

    def test_str_representation(self):
        user = User.objects.create_user(
            email='repr@example.com',
            username='repruser',
            password='password123',
        )
        self.assertIn('repr@example.com', str(user))
        self.assertIn('repruser', str(user))

class RegisterViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('user:register')

    def test_successful_registration(self):
        response = self.client.post(self.url, {
            'email': 'new@example.com',
            'username': 'newuser',
            'password': 'securepass123',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['email'], 'new@example.com')
        self.assertNotIn('password', data['data'])
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)

    def test_duplicate_email(self):
        User.objects.create_user(
            email='taken@example.com',
            username='existing',
            password='password123',
        )
        response = self.client.post(self.url, {
            'email': 'taken@example.com',
            'username': 'newuser',
            'password': 'securepass123',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.json()['success'])

    def test_short_password(self):
        response = self.client.post(self.url, {
            'email': 'short@example.com',
            'username': 'shortpw',
            'password': '123',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.json()['success'])

    def test_missing_fields(self):
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.json()['success'])

class LoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('user:login')
        self.user = User.objects.create_user(
            email='login@example.com',
            username='loginuser',
            password='securepass123',
        )

    def test_successful_login(self):
        response = self.client.post(self.url, {
            'email': 'login@example.com',
            'password': 'securepass123',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)
        self.assertTrue(response.cookies['access_token']['httponly'])
        self.assertTrue(response.cookies['refresh_token']['httponly'])

    def test_wrong_password(self):
        response = self.client.post(self.url, {
            'email': 'login@example.com',
            'password': 'wrongpassword',
        }, format='json')
        self.assertEqual(response.status_code, 401)
        self.assertNotIn('access_token', response.cookies)

    def test_missing_credentials(self):
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, 400)


class RefreshViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('user:login')
        self.refresh_url = reverse('user:token-refresh')
        self.user = User.objects.create_user(
            email='refresh@example.com',
            username='refreshuser',
            password='securepass123',
        )

    def test_refresh_with_valid_cookie(self):
        login_response = self.client.post(self.login_url, {
            'email': 'refresh@example.com',
            'password': 'securepass123',
        }, format='json')
        self.assertEqual(login_response.status_code, 200)

        response = self.client.post(self.refresh_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.cookies)

    def test_refresh_without_cookie(self):
        fresh_client = APIClient()
        response = fresh_client.post(self.refresh_url)
        self.assertEqual(response.status_code, 401)

class LogoutViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('user:login')
        self.logout_url = reverse('user:logout')
        self.user = User.objects.create_user(
            email='logout@example.com',
            username='logoutuser',
            password='securepass123',
        )

    def test_logout_clears_cookies(self):
        self.client.post(self.login_url, {
            'email': 'logout@example.com',
            'password': 'securepass123',
        }, format='json')

        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['data']['logged_out'])
        self.assertEqual(response.cookies['access_token'].value, '')
        self.assertEqual(response.cookies['refresh_token'].value, '')

class ProfileViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('user:login')
        self.profile_url = reverse('user:profile')
        self.user = User.objects.create_user(
            email='me@example.com',
            username='meuser',
            password='securepass123',
        )

    def test_unauthenticated(self):
        fresh_client = APIClient()
        response = fresh_client.get(self.profile_url)
        self.assertEqual(response.status_code, 401)

    def test_authenticated_profile_via_cookie(self):
        self.client.post(self.login_url, {
            'email': 'me@example.com',
            'password': 'securepass123',
        }, format='json')

        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['email'], 'me@example.com')
