from rest_framework import serializers
from .models import  Prescription, OTMAlert

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription

        fields = [
            "id", 
            "drug_name",
            "dosage",
            "sig",
            "rx_number",
            "status",
            "last_filled_date",
            "next_fill_date",
            "is_high_cost",
            "refills_left",
            "insurance_remark"
        ]

class OTMAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTMAlert
        fields = "_all__"