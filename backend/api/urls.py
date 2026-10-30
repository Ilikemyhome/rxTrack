from django.urls import path
from .views import login_view
from .views_ai import explain_prescription

urlpatterns = [
    path("login/", login_view, name="login"),
    path("ai/explain/", explain_prescription, name="explain_prescription"),
]
