from datetime import date, timedelta
from rest_framework import serializers
from .models import Prescription, OTMAlert, Patient
from django.contrib.auth.models import User


# OTM ALERT SERIALIZER

class OTMAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTMAlert
        fields = "__all__"

# PRESCRIPTION SERIALIZER

class PrescriptionSerializer(serializers.ModelSerializer):
    alerts = OTMAlertSerializer(many=True, read_only=True)

    insurance_status = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    next_fill_date = serializers.SerializerMethodField()
    action_type = serializers.SerializerMethodField()
    theme_color = serializers.SerializerMethodField()
    patient_message = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = [
            "id",
            "drug_name",
            "dosage",
            "sig",
            "quantity",
            "refills_left",
            "rx_number",
            "status",
            "insurance_remark",
            "last_filled_date",
            "ready_date",
            "is_high_cost",
            "alerts",   # <-- IMPORTANT
            "insurance_status",
            "days_remaining",
            "next_fill_date",
            "action_type",
            "theme_color",
            "patient_message",
        ]
    
    def get_insurance_status(self, obj):
        if not obj.insurance_remark:
            return None
        
        remark = obj.insurance_remark.upper()

        if "79" in remark:
            return "Refill Too Soon"
        if "75" in remark:
            return "Prior Authorization Required"
        if "MR" in remark:
            return " Not Covered / Formulary Issue"
        if "9G" in remark:
            return "Quantity Limit Exceeded"
        if "39" in remark:
            return "Missing Diagnosis Code"
        
        return "Insurance Issue"
    
    def get_days_remaining(self, obj):
        if not obj.last_filled_date or "79" not in (obj.insurance_remark or ""):
            return None
        
        today = date.today()
        days_since_fill = (today - obj.last_filled_date).days
        days_supply = obj.days_supply or obj.quantity  # Fallback to quantity if days_supply is not provided

        return max(days_supply - days_since_fill, 0)
    
    def get_next_fill_date(self, obj):
        if not obj.last_filled_date:
            return None
        
        if not obj.days_supply:
            return None
        
        return obj.last_filled_date + timedelta(days=obj.days_supply)
    
    def get_action_type(self, obj):

        # If its too soon to refill, we want to show a chat explanation button that explains why and when they can refill
        if obj.insurance_remark and "79" in obj.insurance_remark:
            return "CHAT_EXPLANATION"

        
        # RTS countdown
        if obj.ready_date:
            days_ready = (date.today() - obj.ready_date).days
            if days_ready >= 10:
                return "CONTACT_PHARMACY"
            if days_ready >= 1:
                return "PICK_UP_REMINDER"
        return None
    
    def get_patient_message(self, obj):
        # 1. Refill too soon
        if obj.insurance_remark and "79" in obj.insurance_remark:
            return None

        # 2. Return to stock logic (RTS)
        if obj.ready_date:
            days_ready = (date.today() - obj.ready_date).days

            if days_ready >= 10:
                return "This prescription has been ready for over 10 days and may be returned to stock soon. Please contact the pharmacy."

            if days_ready >= 1:
                return f"Your prescription has been ready for {days_ready} days. Please pick it up soon."

        # 3. Default
        return None

    def get_theme_color(self, obj):
        if obj.ready_date:
            days_ready = (date.today() - obj.ready_date).days
            if days_ready >= 10:
                return "red"
            return "green"
        
        if obj.insurance_remark:
            return "yellow"
        return "blue"
    


# PATIENT SERIALIZER

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            "id",
            "first_name",
            "last_name",
            "date_of_birth",
            "phone_number",
            "email",
        ]



# PATIENT DASHBOARD SERIALIZER

class PatientDashboardSerializer(serializers.ModelSerializer):
    prescriptions = PrescriptionSerializer(many=True, read_only=True)
    patient_alerts = OTMAlertSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = [
            "id",
            "first_name",
            "last_name",
            "date_of_birth",
            "phone_number",
            "prescriptions",
            "patient_alerts",
        ]
class SignupSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    dob = serializers.DateField(required=True)
    phone = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
