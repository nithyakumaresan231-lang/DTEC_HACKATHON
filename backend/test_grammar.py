from app.services.grammar_engine import generate_sentence
from app.services.spell_checker import correct_sentence

def test_grammar_engine():
    print("--- Running Tamil Grammar Engine Tests ---")
    
    # Test Case 1: Standard Masculine Past Tense with Dative Object + Sandhi
    # அவன் + பள்ளி + செல் (Past) -> அவன் பள்ளிக்குச் சென்றான்.
    s1 = generate_sentence("அவன்", "செல்", "பள்ளி", "past")
    print(f"Test 1 - Sentence Builder: {s1}")
    assert s1 == "அவன் பள்ளிக்குச் சென்றான்.", f"Expected: 'அவன் பள்ளிக்குச் சென்றான்.', Got: '{s1}'"
    
    # Test Case 2: First Person Singular Past Tense with Transitive Accusative Object + Sandhi
    # நான் + புத்தகம் + படி (Past) -> நான் புத்தகத்தைப் படித்தேன்.
    s2 = generate_sentence("நான்", "படி", "புத்தகம்", "past")
    print(f"Test 2 - Sentence Builder: {s2}")
    assert s2 == "நான் புத்தகத்தைப் படித்தேன்.", f"Expected: 'நான் புத்தகத்தைப் படித்தேன்.', Got: '{s2}'"
    
    # Test Case 3: Spell Corrector - Conjugation ending correction
    # அவன் சென்றன் -> அவன் சென்றான்
    c1 = correct_sentence("அவன் சென்றன்")
    print(f"Test 3 - Spell Corrector (Vowel Ending): {c1}")
    assert c1 == "அவன் சென்றான்", f"Expected: 'அவன் சென்றான்', Got: '{c1}'"
    
    # Test Case 4: Spell Corrector - Spelling typo + missing Sandhi correction
    # அவண் பள்ளிக்கு சென்ரன் -> அவன் பள்ளிக்குச் சென்றான்
    c2 = correct_sentence("அவண் பள்ளிக்கு சென்ரன்")
    print(f"Test 4 - Spell Corrector (Typo + Missing Sandhi): {c2}")
    assert c2 == "அவன் பள்ளிக்குச் சென்றான்", f"Expected: 'அவன் பள்ளிக்குச் சென்றான்', Got: '{c2}'"
    
    # Test Case 5: Neuter Plural Conjugation
    # அவை + பூங்கா + போ (Future) -> அவை பூங்காவுக்கு போகும்.
    # Note: 'போ' future neuter plural is 'போகும்'
    s3 = generate_sentence("அவை", "போ", "பூங்கா", "future")
    print(f"Test 5 - Neuter Plural: {s3}")
    assert s3 == "அவை பூங்காவுக்குப் போகும்.", f"Expected: 'அவை பூங்காவுக்குப் போகும்.', Got: '{s3}'"
    
    print("\n[SUCCESS] All Tamil Grammar Engine and Spell Check tests passed!")

if __name__ == "__main__":
    test_grammar_engine()
