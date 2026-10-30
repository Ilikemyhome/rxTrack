import os
import google.generativeai as genai
import time

from dotenv import load_dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response

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