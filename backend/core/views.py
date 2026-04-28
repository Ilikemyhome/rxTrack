from django.shortcuts import render
from rest_framework import viewsets
from .models import Prescription, OTMAlert, Patient
from .serializers import PrescriptionSerializer, OTMAlertSerializer

# Create your views here.

class PrescriptionViewSet(viewsets.ModelViewSet):

    # queryset to get all prescriptions
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

class OTMAlertViewSet(viewsets.ModelViewSet):

    # queryset to get all OTM alerts
    queryset = OTMAlert.objects.all()
    serializer_class = OTMAlertSerializer