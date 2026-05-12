from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Prescription, OTMAlert, Patient
from .serializers import PrescriptionSerializer, OTMAlertSerializer, PatientSerializer, PatientDashboardSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from insurance_codes.interpreter import interpret_reject_code
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
    
# Endpoint to get insurance reject codes
@csrf_exempt
def interpret_reject_view(request):
    if request.method == "GET":
        code = request.GET.get("code")
        if not code:
            return JsonResponse({"error": "Add ?code=XX to the URL"})
        return JsonResponse(interpret_reject_code(code), safe=False)
    
    if request.method != "POST":
        return JsonResponse({"error" : "POST request required"}, status=400)
    
    try:
        body = json.loads(request.body)
        code = body.get("code")

    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    if not code:
        return JsonResponse({"error": "Missing 'code' field"}, status=400)
    
    result = interpret_reject_code(code)


