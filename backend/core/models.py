from django.db import models

# Create your models here.


# creates patient model with first name, last name, date of birth, and phone number
class Patient(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    phone_number = models.CharField(max_length=20)

    # string representation of the patient model
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
# creates prescription model with patient name, drug name, rx number, status, last filled date, and next fill date, and is high cost
class Prescription(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="prescriptions")
    drug_name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=100, blank=True, null=True)    
    quantity = models.IntegerField(default=30)
    sig = models.CharField(max_length=255, blank=True, null=True)
    rx_number = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20)
    last_filled_date = models.DateField(null=True, blank=True)
    next_fill_date = models.DateField(null=True, blank=True)
    is_high_cost = models.BooleanField()
    refills_left = models.IntegerField(default=0)
    insurance_remark = models.TextField(blank=True, null=True)  
    
    

    # string representation of the prescription model
    def __str__(self):
        return f"{self.drug_name} for {self.patient.first_name} {self.patient.last_name}"
    
# creates OTM alert model with prescription, alert type, creted at, and is resolved
class OTMAlert(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="patient_alerts",
        null=True,
        blank=True
    )

    prescription = models.ForeignKey(
        Prescription,
        on_delete=models.CASCADE,
        related_name="alerts",
        null=True,
        blank=True
    )

    alert_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        target = (
            self.prescription.drug_name
            if self.prescription
            else f"{self.patient.first_name} {self.patient.last_name}"
        )
        status = "Resolved" if self.is_resolved else "Unresolved"
        return f"{self.alert_type} for {target} - {status}"
