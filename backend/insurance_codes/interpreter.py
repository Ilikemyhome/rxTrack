from .loader import load_reject_codes

REJECT_CODES = load_reject_codes()

# This will interpret a code and return a structured explanation
def interpret_reject_code(code: str):

    entries = REJECT_CODES.get(code)

    if not entries:
        return {
            "code" : code,
            "reason" : "Unknown reject code",
            "details" : [],
            "next_steps" : "Contact insurance for more information",
            "category" : "unknown"
        }
    
    short_desc = entries[0]["short"]
    category = entries[0]["category"]

    details = [e["long"] for e in entries]

    next_steps = generate_next_steps(code, category)

    return {
        "code" : code,
        "reason" : short_desc,
        "details" : details,
        "category" : category,
        "next_steps" : next_steps
    }


def generate_next_steps(code: str, category: str):
    if code == "75":
        return "Contact the prescriber to initiate a prior authorization. Verify dosage and NDC requirements."
    
    if code == "79":
        return "Check last fill date and calculate the next eligible refill date."
    
    if code == "88":
        return (
            "This claim triggered a DUR safety review. "
            "The pharmacy needed to enter additional override codes before approval. "
            "These reviews can cause delays, especially for interactions, high doses, or duplicate therapy."
        )
    
    if code == "70":
        return "Verify formulary status and consider alternative medications."
    
    if category == "service":
        return "Verify patient demographics and resubmit the claim."
   
    if category == "insurance":
        return "Check plan coverage, eligibility, or formulary requirements."
    
    return "Review the claim details and contact the insurance plan if needed."