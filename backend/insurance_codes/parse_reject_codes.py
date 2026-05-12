# This file will turn my csv of insurance reject codes into a json file that can be used for my model

import csv
import json
import os
from collections import defaultdict


def clean(text):
    if not text:
        return ""
    return text.strip().replace('"', '').replace("'", "")

# will categorize the reject codes
def categorize(short_desc):
    text = short_desc.lower()
    
    if "provider" in text:
        return "provider"
    
    if "cardholder" in text or "recipient" in text:
        return "member"
    
    if "date" in text:
        return "service"
    
    if "prescription" in text or "fill" in text:
        return "rx" 
    
    if "ndc" in text or "prduct" in text:
        return "ndc"
    return "other"


# Parse the CSV file and create a dictionary of reject codes  
def parse_csv(file_path):
    data = defaultdict(list)

    with open(file_path, newline="", encoding="utf-8") as csvfile:
        reader = csv.reader(csvfile)

        for row in reader:
            if len(row) < 4 :
                continue  # Skip rows that don't have enough columns

            reject_code = clean(row[0])
            short_desc = clean(row[1])
            edit_code = clean(row[2])   
            long_desc = clean(row[3])

            if reject_code.lower() in ["ncpdp", "reject", "code", "pharmacy ncpdp reject codes"]:
                continue  # Skip header rows
            if not reject_code or not edit_code:
                continue  # Skip rows with missing reject code or edit code

            entry = {
                "edit" : edit_code,
                "short" : short_desc,
                "long" : long_desc,
                "category" : categorize(short_desc)
            }

            data[reject_code].append(entry)

    return data


# Convert the dictionary to JSON and save it to a file

if __name__ == "__main__":
    result = parse_csv("backend\insurance_codes\insurance_reject_codes.csv")
    output_path = os.path.join(os.path.dirname(__file__), "insurance_reject_codes.json")

    with open(output_path, "w", encoding="utf-8") as out:
        json.dump(result, out, indent=4)
    
    print("Done parsing CSV and saving to JSON.")