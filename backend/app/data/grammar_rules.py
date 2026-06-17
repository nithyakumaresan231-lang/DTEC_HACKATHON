# Tamil Grammar Rules Data

PRONOUNS = {
    "நான்": {
        "meaning": "I",
        "person": "first",
        "number": "singular",
        "gender": "neutral",
        "suffix": "ஏன்",
        "suffix_type": "vowel"
    },
    "நாங்கள்": {
        "meaning": "We",
        "person": "first",
        "number": "plural",
        "gender": "neutral",
        "suffix": "ஓம்",
        "suffix_type": "vowel"
    },
    "நீ": {
        "meaning": "You",
        "person": "second",
        "number": "singular",
        "gender": "neutral",
        "suffix": "ஆய்",
        "suffix_type": "vowel"
    },
    "நீங்கள்": {
        "meaning": "You (Plural/Honorific)",
        "person": "second",
        "number": "plural",
        "gender": "honorific",
        "suffix": "ீர்கள்",
        "suffix_type": "vowel"
    },
    "அவன்": {
        "meaning": "He",
        "person": "third",
        "number": "singular",
        "gender": "masculine",
        "suffix": "ஆன்",
        "suffix_type": "vowel"
    },
    "அவள்": {
        "meaning": "She",
        "person": "third",
        "number": "singular",
        "gender": "feminine",
        "suffix": "ஆள்",
        "suffix_type": "vowel"
    },
    "அவர்": {
        "meaning": "He/She (Honorific)",
        "person": "third",
        "number": "singular",
        "gender": "honorific",
        "suffix": "ஆர்",
        "suffix_type": "vowel"
    },
    "அவர்கள்": {
        "meaning": "They (Human)",
        "person": "third",
        "number": "plural",
        "gender": "human_plural",
        "suffix": "ஆர்கள்",
        "suffix_type": "vowel"
    },
    "அது": {
        "meaning": "It",
        "person": "third",
        "number": "singular",
        "gender": "neuter",
        "suffix": "து",  # Special handling in conjugation
        "suffix_type": "special"
    },
    "அவை": {
        "meaning": "They (Neuter)",
        "person": "third",
        "number": "plural",
        "gender": "neuter_plural",
        "suffix": "ன",  # Special handling in conjugation
        "suffix_type": "special"
    }
}

VERBS = {
    "செல்": {
        "meaning": "go",
        "type": "intransitive_directional",
        "stems": {
            "past": "சென்ற",
            "present": "செல்கிற",
            "future_base": "செல்"
        },
        "special_conjugations": {
            "அது": {
                "past": "சென்றது",
                "present": "செல்கிறது",
                "future": "செல்லும்"
            },
            "அவை": {
                "past": "சென்றன",
                "present": "செல்கின்றன",
                "future": "செல்லும்"
            }
        },
        "future_marker": "வ்"  # e.g., செல் + வ் + ஏன் = செல்வேன்
    },
    "படி": {
        "meaning": "read/study",
        "type": "transitive",
        "stems": {
            "past": "படித்த",
            "present": "படிக்கிற",
            "future_base": "படிப்ப"
        },
        "special_conjugations": {
            "அது": {
                "past": "படித்தது",
                "present": "படிக்கிறது",
                "future": "படிக்கும்"
            },
            "அவை": {
                "past": "படித்தன",
                "present": "படிக்கின்றன",
                "future": "படிக்கும்"
            }
        },
        "future_marker": ""  # Stems cover future_base: படிப்ப + ஏன் = படிப்பேன்
    },
    "எழுது": {
        "meaning": "write",
        "type": "transitive",
        "stems": {
            "past": "எழுதின",
            "present": "எழுதுகிற",
            "future_base": "எழுதுவ"
        },
        "special_conjugations": {
            "அது": {
                "past": "எழுதியது",
                "present": "எழுதுகிறது",
                "future": "எழுதும்"
            },
            "அவை": {
                "past": "எழுதின",
                "present": "எழுதுகின்றன",
                "future": "எழுதும்"
            }
        },
        "future_marker": ""
    },
    "செய்": {
        "meaning": "do",
        "type": "transitive",
        "stems": {
            "past": "செய்த",
            "present": "செய்கிற",
            "future_base": "செய்வ"
        },
        "special_conjugations": {
            "அது": {
                "past": "செய்தது",
                "present": "செய்கிறது",
                "future": "செய்யும்"
            },
            "அவை": {
                "past": "செய்தன",
                "present": "செய்கின்றன",
                "future": "செய்யும்"
            }
        },
        "future_marker": ""
    },
    "வா": {
        "meaning": "come",
        "type": "intransitive_directional",
        "stems": {
            "past": "வந்த",
            "present": "வருகிற",
            "future_base": "வருவ"
        },
        "special_conjugations": {
            "அது": {
                "past": "வந்தது",
                "present": "வருகிறது",
                "future": "வரும்"
            },
            "அவை": {
                "past": "வந்தன",
                "present": "வருகின்றன",
                "future": "வரும்"
            }
        },
        "future_marker": ""
    },
    "போ": {
        "meaning": "go",
        "type": "intransitive_directional",
        "stems": {
            "past": "போன",
            "present": "போகிற",
            "future_base": "போவ"
        },
        "special_conjugations": {
            "அது": {
                "past": "போனது",
                "present": "போகிறது",
                "future": "போகும்"
            },
            "அவை": {
                "past": "போனன",
                "present": "போகின்றன",
                "future": "போகும்"
            }
        },
        "future_marker": ""
    },
    "ஓடு": {
        "meaning": "run",
        "type": "intransitive_directional",
        "stems": {
            "past": "ஓடின",
            "present": "ஓடுகிற",
            "future_base": "ஓடுவ"
        },
        "special_conjugations": {
            "அது": {
                "past": "ஓடியது",
                "present": "ஓடுகிறது",
                "future": "ஓடும்"
            },
            "அவை": {
                "past": "ஓடின",
                "present": "ஓடுகின்றன",
                "future": "ஓடும்"
            }
        },
        "future_marker": ""
    },
    "பாடு": {
        "meaning": "sing",
        "type": "transitive",
        "stems": {
            "past": "பாடின",
            "present": "பாடுகிற",
            "future_base": "பாடுவ"
        },
        "special_conjugations": {
            "அது": {
                "past": "பாடியது",
                "present": "பாடுகிறது",
                "future": "பாடும்"
            },
            "அவை": {
                "past": "பாடின",
                "present": "பாடுகின்றன",
                "future": "பாடும்"
            }
        },
        "future_marker": ""
    }
}

OBJECTS = {
    "பள்ளி": {
        "meaning": "school",
        "accusative": "பள்ளியை",  # பள்ளி + ய் + ஐ
        "dative": "பள்ளிக்கு"     # பள்ளி + க்கு
    },
    "புத்தகம்": {
        "meaning": "book",
        "accusative": "புத்தகத்தை",  # புத்தகம் -> புத்தகத்து + ஐ
        "dative": "புத்தகத்திற்கு"     # புத்தகம் -> புத்தகத்து + இற்கு
    },
    "கடிதம்": {
        "meaning": "letter",
        "accusative": "கடிதத்தை",
        "dative": "கடிதத்திற்கு"
    },
    "வேலை": {
        "meaning": "work",
        "accusative": "வேலையை",
        "dative": "வேலைக்கு"
    },
    "பாடம்": {
        "meaning": "lesson",
        "accusative": "பாடத்தை",
        "dative": "பாடத்திற்கு"
    },
    "வீடு": {
        "meaning": "house/home",
        "accusative": "வீட்டை",
        "dative": "வீட்டுக்கு"
    },
    "பூங்கா": {
        "meaning": "park",
        "accusative": "பூங்காவை",
        "dative": "பூங்காவுக்கு"
    },
    "பாடல்": {
        "meaning": "song",
        "accusative": "பாடலை",
        "dative": "பாடலுக்கு"
    }
}

# Consonant doubling rules (Sandhi - சந்தி)
# If Object ends with a vowel and next word (Verb) starts with plosive (வல்லினம்: க, ச, த, ப), double it.
SANDHI_MAP = {
    "க": "க்",
    "கா": "க்",
    "கி": "க்",
    "கீ": "க்",
    "கு": "க்",
    "கூ": "க்",
    "கெ": "க்",
    "கே": "க்",
    "கை": "க்",
    "கொ": "க்",
    "கோ": "க்",
    "கௌ": "க்",
    
    "ச": "ச்",
    "சா": "ச்",
    "சி": "ச்",
    "சீ": "ச்",
    "சு": "ச்",
    "சூ": "ச்",
    "செ": "ச்",
    "சே": "ச்",
    "சை": "ச்",
    "சொ": "ச்",
    "சோ": "ச்",
    "சௌ": "ச்",
    
    "த": "த்",
    "தா": "த்",
    "தி": "த்",
    "தீ": "த்",
    "து": "த்",
    "தூ": "த்",
    "தெ": "த்",
    "தே": "த்",
    "தை": "த்",
    "தொ": "த்",
    "தோ": "த்",
    "தௌ": "த்",
    
    "ப": "ப்",
    "பா": "ப்",
    "பி": "ப்",
    "பீ": "ப்",
    "பு": "ப்",
    "பூ": "ப்",
    "பெ": "ப்",
    "பே": "ப்",
    "பை": "ப்",
    "பொ": "ப்",
    "போ": "ப்",
    "பௌ": "ப்",
}
