from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Prescription, OTMAlert, Patient
from .serializers import PrescriptionSerializer, OTMAlertSerializer, PatientSerializer, PatientDashboardSerializer, SignupSerializer, LoginSerializer
from django.contrib.auth.models import User
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import date, timedelta
import json
from rest_framework import permissions
from django.contrib.auth import authenticate

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
    

class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        first_name = serializer.validated_data["first_name"]
        last_name = serializer.validated_data["last_name"]
        dob = serializer.validated_data["dob"]
        phone = serializer.validated_data["phone"]
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)
    
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        patient = Patient.objects.filter(
            first_name__iexact=first_name,
            last_name__iexact=last_name,
            date_of_birth=dob,
            phone_number=phone,
        ).first()

        has_patient = False
        patient_data = None
        prescriptions_data = []

        if patient:
            patient.user = user
            if not patient.email:
                patient.email = email
            patient.save()
            has_patient = True
            patient_data = PatientSerializer(patient).data
            prescriptions_data = PrescriptionSerializer(patient.prescriptions.all(), many=True).data

        return Response({
            "user_id": user.id,
            "email": user.email,
            "has_patient": has_patient,
            "patient": patient_data,
            "prescriptions": prescriptions_data,
        }, status=status.HTTP_201_CREATED)
    

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user_object = User.objects.filter(email=email).first()
        if not user_object:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(username=user_object.username, password=password)
        if not user:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        
        patient = getattr(user, "patient_profile", None)

        if patient:
            patient_data = PatientSerializer(patient).data
            prescriptions_data = PrescriptionSerializer(patient.prescriptions.all(), many=True).data
            alerts_data = OTMAlertSerializer(patient.patient_alerts.all(), many=True).data

            return Response({
                "user_id": user.id,
                "email": user.email,
                "has_patient": True,
                "patient": patient_data,
                "prescriptions": prescriptions_data,
                "alerts": alerts_data,
            }, status=status.HTTP_200_OK)
        
        return Response({
            "user_id": user.id,
            "email": user.email,
            "has_patient": False,
            "message": "No prescriptions found for this account."
        }, status=status.HTTP_200_OK)

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
    return JsonResponse(result, safe=False)


@api_view(["GET"])
def prescription_explanation(request, rx_number):

    # find prescription by rx_number
    try:
        prescription = Prescription.objects.get(rx_number=rx_number)
    except Prescription.DoesNotExist:
        return Response({"error": "Prescription not found"}, status=404)
    
    # if no ins remark, nothing to explain
    if not prescription.insurance_remark:
        return Response({
            "reason": None,
            "message": "No insurance issues for this prescription"
            },status=200)
    
    # extract reject code from insurance remark
    remark = prescription.insurance_remark.upper()
    code = None

    for part in remark.split():
        if part.isdigit() or (len(part) == 2 and part.isalnum()):
            code = part
            break

  
    
    # interpret the code
    explanation = interpret_reject_code(code) if code else {}

    response = {
        "reason": explanation.get("reason"),
        "message": explanation.get("message") or "Insurance issue detected"
    }

    # refill too soon if needed
    if code == "79" and prescription.last_filled_date:
        today = date.today()
        days_since_fill = (today - prescription.last_filled_date).days
        days_supply = prescription.days_supply or prescription.quantity  # Fallback to quantity if days_supply is not provided
        days_remaining = max(days_supply - days_since_fill, 0)
        next_fill = prescription.last_filled_date + timedelta(days=days_supply)

        
        response["days_remaining"] = days_remaining
        response["next_fill_date"] = next_fill

    return Response(response, status=200)
       