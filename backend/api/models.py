from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserRole(models.Model):
    USER_ROLES = (
        ("student", "Student"),
        ("teacher", "Teacher"),
        ("admin", "Admin")
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="role")
    role = models.CharField(max_length=20, choices=USER_ROLES, default="student")

    def __str__ (self):
        return f"{self.role}"


class UserLanguagePreference(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    language_to_learn = models.CharField(max_length=50)  # e.g., 'Spanish', 'French', 'German'
    proficiency_level = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Hi! I'm {self.user.username} and I want to learn {self.language_to_learn}"
