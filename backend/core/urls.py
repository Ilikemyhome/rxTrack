from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrescriptionViewSet, PatientViewset, PatientDashboardViewSet

router = DefaultRouter()
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'patients', PatientViewset)

urlpatterns = [
    path('', include(router.urls)),
    path('patients/<int:patient_id>/dashboard/', PatientDashboardViewSet.as_view(), name='patient-dashboard'),
]