from rest_framework import serializers
from .models import Prescription, OTMAlert, Patient


# OTM ALERT SERIALIZER

class OTMAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTMAlert
        fields = "__all__"

# PRESCRIPTION SERIALIZER

class PrescriptionSerializer(serializers.ModelSerializer):
    alerts = OTMAlertSerializer(many=True, read_only=True)

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
            "next_fill_date",
            "is_high_cost",
            "alerts",   # <-- IMPORTANT
        ]


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
