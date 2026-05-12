import json
import os

def load_reject_codes():
    file_path = os.path.join(os.path.dirname(__file__), "insurance_reject_codes.json")

    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)