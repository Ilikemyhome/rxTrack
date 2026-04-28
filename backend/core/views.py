from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Prescription, OTMAlert, Patient
from .serializers import PrescriptionSerializer, OTMAlertSerializer, PatientSerializer, PatientDashboardSerializer

# Create your views here.

# Patient views

class PatientViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class PrescriptionViewSet(viewsets.ReadOnlyModelViewSet):

    # queryset to get all prescriptions
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

class OTMAlertViewSet(viewsets.ReadOnlyModelViewSet):

    # queryset to get all OTM alerts
    queryset = OTMAlert.objects.all()
    serializer_class = OTMAlertSerializer

class PatientDashboardViewSet(APIView):

    def get(self, request, patient_id):
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=404)

        serializer = PatientDashboardSerializer(patient)
        return Response(serializer.data)