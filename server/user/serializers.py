from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        max_length=128,
        style={'input_type': 'password'},
        error_messages={
            'min_length': 'Password terlalu pendek. Minimal 8 karakter.',
            'blank': 'Password tidak boleh kosong.',
        },
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password']
        read_only_fields = ['id']
        extra_kwargs = {
            'email': {
                'required': True,
                'error_messages': {
                    'required': 'Email wajib diisi.',
                    'blank': 'Email tidak boleh kosong.',
                    'invalid': 'Format email tidak valid.',
                },
            },
            'username': {
                'required': True,
                'min_length': 3,
                'max_length': 30,
                'error_messages': {
                    'required': 'Username wajib diisi.',
                    'blank': 'Username tidak boleh kosong.',
                    'min_length': 'Username terlalu pendek. Minimal 3 karakter.',
                },
            },
        }

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'date_joined']
        read_only_fields = fields
