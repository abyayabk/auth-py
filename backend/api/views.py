from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, UserLanguagePreferenceSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import UserLanguagePreference

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
class UserLanguagePreferenceView(generics.ListCreateAPIView):
    serializer_class = UserLanguagePreferenceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserLanguagePreference.objects.filter(user=self.request.user)
    
    # def perform_create(self, serializer):
    #     if serializer.is_valid():
    #         serializer.save(user=self.request.user)
    #     else:
    #         print(serializer.errors)
