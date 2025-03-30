from . import views
from django.urls import path

urlpatterns =[
    path("language-preference/", views.UserLanguagePreferenceView.as_view(), name="language-preference"),
]