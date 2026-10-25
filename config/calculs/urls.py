
from django.urls import path
from .views import effectuer_calcul

urlpatterns = [
    path("", effectuer_calcul, name="effectuer_calcul"),
]
