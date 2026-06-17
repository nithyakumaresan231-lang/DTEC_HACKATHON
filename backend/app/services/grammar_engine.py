from app.data.grammar_rules import PRONOUNS, VERBS, OBJECTS, SANDHI_MAP

def conjugate_verb(subject: str, verb: str, tense: str) -> str:
    """
    Conjugates the verb according to the subject pronoun and tense.
    """
    if verb not in VERBS:
        raise ValueError(f"Verb '{verb}' is not supported.")
    
    verb_data = VERBS[verb]
    
    if subject not in PRONOUNS:
        raise ValueError(f"Subject '{subject}' is not supported.")
        
    pronoun_data = PRONOUNS[subject]
    
    # Neuter pronoun special rules (irregular conjugations)
    if subject in ["அது", "அவை"]:
        if subject in verb_data.get("special_conjugations", {}):
            return verb_data["special_conjugations"][subject][tense]
            
    # Standard human pronoun conjugation
    stem = ""
    if tense == "past":
        stem = verb_data["stems"]["past"]
    elif tense == "present":
        stem = verb_data["stems"]["present"]
    elif tense == "future":
        stem = verb_data["stems"]["future_base"]
        # If there's a future marker, append it along with inherent 'a' vowel representation
        if verb_data.get("future_marker"):
            stem = stem + verb_data["future_marker"] + "அ"
    else:
        raise ValueError(f"Tense '{tense}' is not supported.")
        
    suffix = pronoun_data["suffix"]
    
    # Map starting vowel of suffix to corresponding Tamil vowel sign
    VOWEL_SIGN_MAP = {
        "ஆ": "ா",
        "ஏ": "ே",
        "ஓ": "ோ",
        "ஈ": "ீ",
    }
    
    first_char = suffix[0]
    vowel_sign = VOWEL_SIGN_MAP.get(first_char, "")
    
    if stem and suffix:
        last_letter = stem[-1]
        rest_of_suffix = suffix[1:]
        # Conjugation replaces the inherent vowel of the stem-final letter with the suffix vowel sign
        conjugated = stem[:-1] + last_letter + vowel_sign + rest_of_suffix
        return conjugated
        
    return stem + suffix

def decline_object(object_name: str, verb: str) -> str:
    """
    Declines the object noun according to whether the verb is transitive (accusative -ஐ)
    or intransitive/directional (dative -க்கு).
    """
    if object_name not in OBJECTS:
        raise ValueError(f"Object '{object_name}' is not supported.")
        
    object_data = OBJECTS[object_name]
    
    if verb not in VERBS:
        raise ValueError(f"Verb '{verb}' is not supported.")
        
    verb_data = VERBS[verb]
    
    if verb_data["type"] == "intransitive_directional":
        return object_data["dative"]
    else:
        return object_data["accusative"]

def apply_sandhi(object_declined: str, conjugated_verb: str) -> str:
    """
    Applies Sandhi rules (consonant doubling) at the boundary between the declined object and the verb.
    """
    if not conjugated_verb:
        return object_declined
        
    first_char = conjugated_verb[0]
    
    # Check if the verb starts with a doubling plosive
    if first_char in SANDHI_MAP:
        double_consonant = SANDHI_MAP[first_char]
        return object_declined + double_consonant
        
    return object_declined

def generate_sentence(subject: str, verb: str, object_name: str, tense: str) -> str:
    """
    Generates a full grammatically correct Tamil sentence from subject, verb, object, and tense.
    """
    conjugated_verb = conjugate_verb(subject, verb, tense)
    declined_obj = decline_object(object_name, verb)
    sandhi_obj = apply_sandhi(declined_obj, conjugated_verb)
    
    # Combine subject, object (with sandhi), and verb
    sentence = f"{subject} {sandhi_obj} {conjugated_verb}."
    return sentence

def generate_explanation(subject: str, verb: str, object_name: str, tense: str) -> dict:
    """
    Generates detailed explanation of the grammatical components used in the sentence building.
    """
    conjugated_verb = conjugate_verb(subject, verb, tense)
    declined_obj = decline_object(object_name, verb)
    sandhi_obj = apply_sandhi(declined_obj, conjugated_verb)
    
    pronoun_info = PRONOUNS.get(subject, {})
    verb_info = VERBS.get(verb, {})
    object_info = OBJECTS.get(object_name, {})
    
    # Determine the case suffix applied
    case_type = "இரண்டாம் வேற்றுமை (Accusative Case -ஐ)" if verb_info.get("type") == "transitive" else "நான்காம் வேற்றுமை (Dative Case -க்கு)"
    
    # Sandhi explanation
    sandhi_added = sandhi_obj[len(declined_obj):] if len(sandhi_obj) > len(declined_obj) else ""
    sandhi_explanation = f"சந்தி (Sandhi): மெய்யெழுத்து '{sandhi_added}' மிகுந்துள்ளது." if sandhi_added else "சந்தி விதிமுறை பொருந்தவில்லை."

    return {
        "subject": {
            "word": subject,
            "meaning": pronoun_info.get("meaning", ""),
            "person": pronoun_info.get("person", ""),
            "gender": pronoun_info.get("gender", ""),
            "number": pronoun_info.get("number", "")
        },
        "object": {
            "root": object_name,
            "meaning": object_info.get("meaning", ""),
            "declined": declined_obj,
            "sandhi_applied": sandhi_obj,
            "case_type": case_type
        },
        "verb": {
            "root": verb,
            "meaning": verb_info.get("meaning", ""),
            "tense": tense,
            "conjugated": conjugated_verb,
            "suffix": pronoun_info.get("suffix", "") if subject not in ["அது", "அவை"] else "ஒன்றன்பால்/பலவன்பால் விகுதி"
        },
        "sandhi": {
            "consonant_doubled": sandhi_added,
            "explanation": sandhi_explanation
        },
        "full_sentence": f"{subject} {sandhi_obj} {conjugated_verb}."
    }
