from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserLanguagePreference, UserRole

class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ["role"]

class UserSerializer(serializers.ModelSerializer):
    role = UserRoleSerializer(read_only=True)
    class Meta:
        model = User
        fields = ["id", "username", "password", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Remove role from validated_data as it's not a User field
        role_data = validated_data.pop('role', None)
        # Create the user
        user = User.objects.create_user(**validated_data)
        # Create the role
        UserRole.objects.create(user=user, role="student")
        return user
    
    def delete(self, validated_data):
        user = User.objects.get(id=validated_data.id)
        user.delete()
        return user

class UserLanguagePreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLanguagePreference
        fields = ["id", "user", "language_to_learn", "proficiency_level", "created_at"]

