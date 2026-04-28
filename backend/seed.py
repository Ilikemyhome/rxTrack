import os
import django
from datetime import date, timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rxtrack_backend.settings")
django.setup()

from core.models import Patient, Prescription, OTMAlert

def run():
    print("Clearing existing data...")
    OTMAlert.objects.all().delete()
    Prescription.objects.all().delete()
    Patient.objects.all().delete()

    
    # SCENARIO 1: All prescriptions READY (no insurance issues)
    
    patient1 = Patient.objects.create(
        first_name="Princess",
        last_name="Felix",
        date_of_birth=date(2004, 5, 15),
        phone_number="123-456-7890"
    )

    rx1 = Prescription.objects.create(
        patient=patient1,
        drug_name="Oxycodone",
        dosage="10mg",
        sig="Take one tablet by mouth every 4–6 hours as needed for pain",
        quantity=30,
        refills_left=0,
        rx_number="RX219733",
        status="Ready",
        last_filled_date=date.today() - timedelta(days=30),
        next_fill_date=date.today() + timedelta(days=30),
        is_high_cost=False,
        insurance_remark=""
    )

    rx2 = Prescription.objects.create(
        patient=patient1,
        drug_name="Lisdexamfetamine",
        dosage="10mg",
        sig="Take one capsule by mouth every morning",
        quantity=30,
        refills_left=0,
        rx_number="RX219734",
        status="Ready",
        last_filled_date=date.today() - timedelta(days=30),
        next_fill_date=date.today() + timedelta(days=30),
        is_high_cost=False,
        insurance_remark=""
    )

    
    # SCENARIO 2: Insurance rejects (new prescriptions, no fills)
    
    patient2 = Patient.objects.create(
        first_name="Nova",
        last_name="Foo",
        date_of_birth=date(1990, 8, 20),
        phone_number="987-654-3210"
    )

    rx3 = Prescription.objects.create(
        patient=patient2,
        drug_name="Mounjaro",
        dosage="5mg",
        sig="Inject 0.5ml subcutaneously once weekly",
        quantity=6,
        refills_left=2,
        rx_number="RX623889",
        status="Delayed",
        insurance_remark="REJECT MR: PRODUCT NOT IN FORMULARY",
        last_filled_date=None,      # NEW prescription stuck in insurance
        next_fill_date=None,        # No refill cycle yet
        is_high_cost=True
    )

    rx4 = Prescription.objects.create(
        patient=patient2,
        drug_name="Atorvastatin",
        dosage="20mg",
        sig="Take one tablet by mouth once daily",
        quantity=90,
        refills_left=3,
        rx_number="RX623890",
        status="Delayed",
        insurance_remark="REJECT 9G: QUANTITY EXCEEDS MAXIMUM ALLOWED",
        last_filled_date=None,      # NEW prescription stuck in insurance
        next_fill_date=None,
        is_high_cost=False
    )

    
    # SCENARIO 3: Missing diagnosis code (insurance reject)
    
    p3 = Patient.objects.create(
        first_name="Kyna",
        last_name="Borja",
        date_of_birth=date(2005, 7, 11),
        phone_number="555-987-6543"
    )

    rx5 = Prescription.objects.create(
        patient=p3,
        drug_name="Methylphenidate",
        dosage="5mg Tablet",
        quantity=60,
        sig="Take 1 tablet by mouth twice daily",
        refills_left=0,
        rx_number="RX298877",
        status="Delayed",
        insurance_remark="REJECT 39: MISSING DIAGNOSIS CODE",
        last_filled_date=None,      # Never filled
        next_fill_date=None,
        is_high_cost=False
    )

    # SCENARIO 4: One ready, one refill too soon, one in progress
    p4 = Patient.objects.create(
        first_name="Ingrid",
        last_name="Arenas",
        date_of_birth=date(2005, 12, 8),
        phone_number="555-123-4567"
    )

    rx6 = Prescription.objects.create(
        patient=p4,
        drug_name="Sertraline",
        dosage="50mg",
        sig="Take one tablet by mouth once daily",
        quantity=30,
        refills_left=0,
        rx_number="RX298878",
        status="Ready",
        insurance_remark="",
        last_filled_date=date.today() - timedelta(days=30),
        next_fill_date=date.today() + timedelta(days=30),
        is_high_cost=False
    )
    rx7 = Prescription.objects.create(
        patient=p4,
        drug_name="Alprazolam",
        dosage="0.25mg",
        sig="Take one tablet by mouth as needed for anxiety",
        quantity=30,
        refills_left=0,
        rx_number="RX498879",
        status="In Progress",
        insurance_remark="",
        last_filled_date=None,
        next_fill_date=None,
        is_high_cost=False
    )

    rx8 = Prescription.objects.create(
        patient=p4,
        drug_name="Gabapentin",
        dosage="600mg",
        sig="Take one tablet by mouth three times a day",
        quantity=180,
        refills_left=0,
        rx_number="RX698880",
        status="Delayed",
        insurance_remark="REJECT 79: REFILL TOO SOON",
        last_filled_date=date.today() - timedelta(days=10),
        next_fill_date=date.today() + timedelta(days=20),
        is_high_cost=False
    )


    # SCENARIO 5: No prescriptions in process but pt has otm alerts (e.g. vaccine due, overdue refills, etc)

    p5 = Patient.objects.create(
        first_name="Danuel",
        last_name="Delmundo",
        date_of_birth=date(1985, 3, 22),
        phone_number="555-321-6549"
    )

    rx9 = Prescription.objects.create(
        patient=p5,
        drug_name="Lisinopril",
        dosage="10mg",
        sig="Take one tablet by mouth once daily",
        quantity=90,
        refills_left=3,
        rx_number="RX698877",
        status="Delayed",
        insurance_remark="",
        last_filled_date=date.today() - timedelta(days=90),
        next_fill_date=date.today() - timedelta(days=30),
        is_high_cost=False
    )
    # Alerts
  
    OTMAlert.objects.create(
        prescription=rx3,
        alert_type="High Cost Follow-Up",
        is_resolved=False
    )

    OTMAlert.objects.create(
        prescription=rx9,
        alert_type="Refill Overdue",
        is_resolved=False
    )

    OTMAlert.objects.create(
        patient=p5,
        alert_type="Covid Vaccine Due",
        is_resolved=False
    )

    print("Database seeded successfully!")

if __name__ == "__main__":
    run()
