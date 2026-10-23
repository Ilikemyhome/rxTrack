from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrescriptionViewSet, PatientViewset, PatientDashboardViewSet, interpret_reject_view, SignupView, LoginView, OTMAlertViewSet


router = DefaultRouter()
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'patients', PatientViewset)

urlpatterns = [
    
    path('', include(router.urls)),
    path('api/patients/<int:patient_id>/dashboard/', PatientDashboardViewSet.as_view(), name='patient-dashboard'),
    path('reject/interpret/', interpret_reject_view),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path("api/", include("api.urls")),

]


