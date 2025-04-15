from django.db.models.signals import post_migrate
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import UserRole

@receiver(post_migrate)
def create_default_admin(sender, **kwargs):
    if not User.objects.filter(username="admin").exists():
        user = User.objects.create_superuser(username="admin", password="admin")
        UserRole.objects.create(user=user, role="admin")
