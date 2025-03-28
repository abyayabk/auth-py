from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserLanguagePreference

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserLanguagePreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLanguagePreference
        fields = ["id", "user", "language_to_learn", "proficiency_level", "created_at"]

