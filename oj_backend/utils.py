""" Utils for the backend. """
import tempfile
import shutil
import re
import json
from pathlib import Path
from ollama import chat
from fastapi import UploadFile

from services.pdf_plumber import plumb_text_from_pdf


def generate_prompt(job_text: str, cv_text: str) -> str:
    return f"""
    Je bent een uiterst kritische AI Recruiter. Je doel is een eerlijke vergelijking te maken tussen het CV en de Vacature en een motivatiebrief te schrijven volgens de VDAB-normen.

    ---
    VACATURE:
    {job_text}

    ---
    CV:
    {cv_text}
    ---

    STRIKTE ANALYSE REGELS:
    1. MATCHED SKILLS: Alleen vaardigheden die LETTERLIJK of als DIRECT SYNONIEM in beide teksten voorkomen.
    2. MISSING SKILLS: Alleen concrete vereisten uit de vacature die ontbreken op het CV.
    3. MATCH PERCENTAGE:
       - 80-100%: Perfecte match.
       - 60-79%: Goede basis, mist details.
       - 40-59%: Verschillend vakgebied, maar overdraagbare technische skills.
       - <40%: Geen relevante match.

    RICHTLIJNEN VOOR DE VDAB-MOTIVATIEBRIEF:
        Schrijf een volledige brief in het veld 'motivation_letter' met deze opbouw:
        1. CONTACTGEGEVENS KANDIDAAT: Extraheer de volledige naam, adres, telefoonnummer en e-mail van de kandidaat uit het CV en zet deze bovenaan.
        2. CONTACTGEGEVENS BEDRIJF: Extraheer de bedrijfsnaam en locatie uit de vacature. Indien onbekend, gebruik "De selectiecommissie" of "Uw organisatie".
        3. ONDERWERP: Gebruik de exacte functietitel uit de vacature.
        4. AANSPREKING: Zoek naar een contactpersoon in de vacature. Indien gevonden: "Geachte [Naam],". Indien onbekend: "Beste,".
        5. INLEIDING: Schrijf een persoonlijke openingszin die direct de link legt tussen de kandidaat en de kernwaarde van de vacature.
        6. MOTIVATIE & TROEVEN:
        - Leg uit waarom de kandidaat specifiek voor dít bedrijf kiest op basis van de vacaturetekst.
        - Bewijs waarom de kandidaat geschikt is door specifieke projecten of prestaties van het CV te koppelen aan de eisen van de job.
        7. AFSLUITING: Gebruik een krachtige zin over de wens om de motivatie in een persoonlijk gesprek toe te lichten.
        8. GROET: Eindig met "Met vriendelijke groet," gevolgd door de volledige naam van de kandidaat.

        STRIKTE VOORWAARDEN:
        - Gebruik NOOIT placeholders (zoals [Naam]). Als informatie ontbreekt, formuleer de zin dan zodanig dat het wegvallen niet opvalt.
        - Gebruik \\n voor alle witregels en alinea-overgangen in de JSON string.
        - Schrijf in professioneel, foutloos Nederlands (u-vorm)

        GEEF UITSLUITEND JSON TERUG:
        {{
            "match_percentage": <int>,
            "matched_skills": ["skill1", "skill2"],
            "missing_skills": ["skill1", "skill2"],
            "motivation_letter": "...",
            "match_text": "[VOLLEDIGE NAAM VAN CV] heeft een
            [PERFECTE | GOEDE | GEMIDDELDE | LAGE] match met de vacature."
        }}
        """


def extract_json(json_text: str):
    """Extracts JSON from a string."""
    match = re.search(r'```json\s+(.*?)\s+```', json_text, re.DOTALL)
    if match:
        return json.loads(match.group(1))
    else:
        start = json_text.find('{')
        end = json_text.rfind('}') + 1
        if start != -1 and end != 0:
            content = json_text[start:end]
        else:
            content = json_text

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON format"}


async def process_match(vacancy_text: str, cv_file: UploadFile):
    """Process the match between the vacancy and the CV."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(cv_file.file, tmp)
        tmp_path = Path(tmp.name)

    try:
        cv_content = plumb_text_from_pdf(tmp_path)
        if not cv_content.strip():
            raise ValueError(status_code=400, detail="Invalid CV file")

        generated_prompt = generate_prompt(vacancy_text, cv_content)
        print(generated_prompt)
        response = chat(
            model='deepseek-r1',
            messages=[{"role": "user", "content": generated_prompt}],
            options={"temperature": 0.2}
        )

        extracted_data = extract_json(response.message.content)
        return extracted_data
    except Exception as e:
        raise ValueError(status_code=500,
                         detail=f"Internal server error: {str(e)}") from e
    finally:
        if tmp_path.exists():
            tmp_path.unlink()
