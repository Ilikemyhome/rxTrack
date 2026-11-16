import os
import google.generativeai as genai
import time

from dotenv import load_dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response
from core.models import Patient, Prescription, OTMAlert

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)


@api_view(["POST"])
def explain_prescription(request):

    try:
        print("===== AI REQUEST STARTED =====")

        drug_name = request.data.get("drug_name")
        status = request.data.get("status")
        insurance_status = request.data.get("insurance_status")
        patient_message = request.data.get("patient_message")

        print("Patient data received")

        prompt = f"""
        Explain this prescription issue in plain language.

        Medication: {drug_name}
        Status: {status}
        Insurance: {insurance_status}
        Message: {patient_message}

        Keep under 75 words.
        Requirements:
            - Use simple language.
            - Be supportive and reassuring.
            - Do not blame the patient.
            - Avoid making the patient feel responsible for the delay.
            - Explain the issue in a neutral way.
            - Provide practical next steps.
            - Do not imply that actions have already been taken.
            - Do not promise outcomes or assistance that may not have occurred.
            - Only describe the information provided.
        """

        print("Prompt created")

        model = genai.GenerativeModel(
            "models/gemini-3.5-flash-lite"
        )

        print("Model initialized")
        print("Starting generation...")
        start = time.time()

        response = model.generate_content(prompt)
        end = time.time()
        print("Response received from Gemini")
        print(f"Generation took {end - start:.2f} seconds")

        return Response({
            "message": response.text
        })

    except Exception as e:

        print("ERROR:", e)

        return Response({
            "error": str(e)
        })

@api_view(["POST"])
def chat_with_remy(request):
    message = request.data.get("message")
    patient_id = request.data.get("patient_id")
    patient = Patient.objects.get(id=patient_id)


    prescriptions = Prescription.objects.filter(patient=patient)
    print(prescriptions)


    prescription_context = ""

    for rx in prescriptions:
        prescription_context += f"""
        Medication: {rx.drug_name}
        Status: {rx.status}
        Cost: {"High" if rx.is_high_cost else "Low"}        
        Refills Left: {rx.refills_left}
        Insurance Remark: {rx.insurance_remark}
        Earliest Refill Date: {rx.earliest_refill_date}
        Expiration Date: {rx.expiration_date}
        Is Controlled: {rx.is_controlled}
        
        """
    
    try:
        print("===== AI REQUEST STARTED =====")
        start = time.time()
        message = request.data.get("message")

        prompt = f"""
        You are Remy, the friendly AI assistant for rxTrack.

        Current Patient: {patient.first_name} {patient.last_name}
        Current Prescriptions: {prescription_context}


        Help users understand prescriptions,
        insurance issues, refills, and pharmacy terms.

        If the user asks about their medications,
        prescriptions, refill status, delays,
        insurance issues, expired prescriptions,
        or prescriptions that are ready for pickup,
        use the Current Prescriptions information
        provided above.

        If information about a prescription exists,
        prioritize that information over general
        pharmacy knowledge.

        If a prescription status is Ready,
        tell the patient it is ready for pickup.

        If a prescription status is Expired,
        explain that the prescription appears to
        have expired and a new prescription may
        be needed from the prescriber.

        If the user asks a general pharmacy question,
        answer normally.

        Use clear, simple language.
        Be friendly and supportive.
        Do not recommend treatments,
        home remedies,
        supplements,
        or medications.

        Only explain pharmacy,
        insurance,
        prescription,
        and refill topics.
        Do not provide medical advice.
        Do not imply that actions have been taken.
        Do not promise assistance or outcomes.
        Do not claim that you, RxTrack, a pharmacy, or a doctor will perform actions.
        Only explain information and suggest possible next steps.
        Keep responses under 50 words.

        Question:
        {message}
        """
        print("Prompt created")
        model = genai.GenerativeModel(
            "models/gemini-3.5-flash-lite"
        )
        print("Model initialized")
        print("Starting generation...")

        response = model.generate_content(prompt)
        end = time.time()
        print(f"Generation took {end - start:.2f} seconds")
        return Response({
            "message": response.text
        })

    except Exception as e:
        return Response({
            "error": str(e)
        })