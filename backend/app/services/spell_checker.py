import functools
from app.data.grammar_rules import PRONOUNS, VERBS, OBJECTS, SANDHI_MAP
from app.services.grammar_engine import conjugate_verb

@functools.lru_cache(maxsize=1)
def get_valid_vocabulary():
    """
    Dynamically generates the entire set of valid words known to the system.
    This acts as the dictionary for spell checking.
    """
    vocab = set()
    
    # 1. Subject Pronouns
    for p in PRONOUNS.keys():
        vocab.add(p)
        
    # 2. Objects (raw, accusative, dative)
    for obj, data in OBJECTS.items():
        vocab.add(obj)
        vocab.add(data["accusative"])
        vocab.add(data["dative"])
        
        # Add Sandhi conjugated forms of objects
        for consonant in set(SANDHI_MAP.values()):
            vocab.add(data["accusative"] + consonant)
            vocab.add(data["dative"] + consonant)
            
    # 3. Conjugated Verbs (for all verbs, subjects, tenses)
    for verb in VERBS.keys():
        for subject in PRONOUNS.keys():
            for tense in ["past", "present", "future"]:
                try:
                    conj = conjugate_verb(subject, verb, tense)
                    vocab.add(conj)
                except Exception:
                    pass
                    
    return vocab

PHONOLOGICAL_GROUPS = [
    {'ண', 'ன', 'ந'},
    {'ர', 'ற'},
    {'ல', 'ள', 'ழ'}
]

def get_char_similarity_cost(c1: str, c2: str) -> float:
    """
    Returns a low substitution cost (0.2) for homophonic Tamil characters (Mayangoligal), 
    and 1.0 for unrelated characters.
    """
    if c1 == c2:
        return 0.0
    for group in PHONOLOGICAL_GROUPS:
        if c1 in group and c2 in group:
            return 0.2
    return 1.0

def levenshtein_distance(s1: str, s2: str) -> float:
    """
    Computes a phonologically-weighted Levenshtein edit distance between s1 and s2.
    """
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)

    if len(s2) == 0:
        return float(len(s1))

    previous_row = [float(k) for k in range(len(s2) + 1)]
    for i, c1 in enumerate(s1):
        current_row = [float(i + 1)]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1.0
            deletions = current_row[j] + 1.0
            substitutions = previous_row[j] + get_char_similarity_cost(c1, c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

def correct_word(word: str, subject: str = None) -> str:
    """
    Corrects a single Tamil word to the closest valid vocabulary entry if the edit distance is low.
    Prioritizes grammatical agreement if subject context is provided to break ties.
    """
    vocab = get_valid_vocabulary()
    
    # Strip punctuation for matching
    clean_word = word.strip(".,?!;:\"'()")
    if not clean_word:
        return word
        
    if clean_word in vocab:
        return word
        
    best_matches = []
    min_dist = 9999
    
    for v in vocab:
        dist = levenshtein_distance(clean_word, v)
        if dist < min_dist:
            min_dist = dist
            best_matches = [v]
        elif dist == min_dist:
            best_matches.append(v)
            
    # Choose threshold based on word length to avoid false corrections
    threshold = 2 if len(clean_word) <= 5 else 3
    if min_dist <= threshold and best_matches:
        # Resolve ties using subject context if available
        best_match = best_matches[0]
        if len(best_matches) > 1 and subject and subject in PRONOUNS:
            if subject in ["அது", "அவை"]:
                expected_ending = "து" if subject == "அது" else "ன"
                for match in best_matches:
                    if match.endswith(expected_ending):
                        best_match = match
                        break
            else:
                expected_suffix = PRONOUNS[subject]["suffix"]
                # Convert expected independent suffix starting vowel to vowel sign
                VOWEL_SIGN_MAP = {
                    "ஆ": "ா",
                    "ஏ": "ே",
                    "ஓ": "ோ",
                    "ஈ": "ீ",
                }
                first_char = expected_suffix[0]
                sign = VOWEL_SIGN_MAP.get(first_char, "")
                suffix_ending = sign + expected_suffix[1:]
                
                for match in best_matches:
                    if match.endswith(suffix_ending):
                        best_match = match
                        break
        else:
            best_match = best_matches[0]
            
        # Re-attach any stripped punctuation
        prefix_idx = word.find(clean_word)
        prefix = word[:prefix_idx]
        suffix = word[prefix_idx + len(clean_word):]
        return prefix + best_match + suffix
        
    return word

def correct_sentence(sentence: str) -> str:
    """
    Corrects spelling mistakes in an input sentence and applies Sandhi rules at boundary zones.
    Uses a two-pass approach to resolve subject context even if the subject pronoun itself was misspelled.
    """
    if not sentence.strip():
        return sentence
        
    words = sentence.split()
    
    # Pass 1: Raw correction without context to resolve any misspelled pronouns
    corrected_words = [correct_word(w, None) for w in words]
    
    # Pre-scan the corrected words for subject pronoun context
    subject = None
    for w in corrected_words:
        clean_w = w.strip(".,?!;:\"'()")
        if clean_w in PRONOUNS:
            subject = clean_w
            break
            
    # Pass 2: Re-correct original words with the resolved subject context if found
    if subject:
        corrected_words = [correct_word(words[i], subject) for i in range(len(words))]
    
    # Post-processing pass: Sandhi (Consonant Doubling) verification
    for i in range(len(corrected_words) - 1):
        w1_full = corrected_words[i]
        w2_full = corrected_words[i+1]
        
        w1 = w1_full.strip(".,?!;:\"'()")
        w2 = w2_full.strip(".,?!;:\"'()")
        
        if not w1 or not w2:
            continue
            
        # If second word starts with a consonant doubling trigger
        if w2[0] in SANDHI_MAP:
            consonant = SANDHI_MAP[w2[0]]
            
            # Find if w1 is a base declined object (ends in vowel, without doubling yet)
            is_declined_obj = False
            raw_declined = ""
            for obj_data in OBJECTS.values():
                if w1 == obj_data["accusative"] or w1 == obj_data["dative"]:
                    is_declined_obj = True
                    raw_declined = w1
                    break
            
            # If it's a declined object and doesn't already have the Sandhi consonant appended
            if is_declined_obj and not w1.endswith(consonant):
                prefix_idx = w1_full.find(w1)
                prefix = w1_full[:prefix_idx]
                suffix = w1_full[prefix_idx + len(w1):]
                corrected_words[i] = prefix + raw_declined + consonant + suffix
                
    return " ".join(corrected_words)
