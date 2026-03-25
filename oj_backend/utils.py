""" Utils for the backend. """
import tempfile
import shutil
import re
import json
from pathlib import Path
from ollama import chat
from fastapi import UploadFile, HTTPException
from services.pymu_pdf import extract_with_pymupdf
from system_prompt import PROMPT_TEMPLATE
# from services.pdf_plumber import plumb_text_from_pdf



def generate_prompt(job_text: str, cv_text: str) -> str:
    """ Genereren van de prompt voor de AI Recruiter. """
    return PROMPT_TEMPLATE.format(vacature=job_text, cv=cv_text)


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


_STOPWORDS = {"and", "or", "with", "the", "a", "an", "in", "of", "for",
              "to", "such", "as", "e.g.", "similar", "related", "other"}

# Termen die duiden op voordelen/benefits, geen vereiste skills
_BENEFIT_KEYWORDS = {
    "vakantiedagen", "vakantie", "bedrijfswagen", "bedrijfswaarde", "tankkaart", "laadpas",
    "nettovergoeding", "groepsverzekering", "hospitalisatieverzekering",
    "verzekering", "brutoloon", "loon", "salaris", "thuiswerk", "thuiswerken",
    "glijdende", "uren", "maaltijdcheques", "ecocheques", "bonussen", "bonus",
    "pensioen", "laptop", "gsm", "smartphone", "fietsvergoeding", "parkeerplaats",
    "premium", "aanbod", "vergoeding",
}

def _key_terms(text: str) -> set[str]:
    """Haal betekenisvolle trefwoorden uit een tekst (min. 3 tekens, geen stopwords)."""
    words = re.findall(r'[A-Za-z][A-Za-z0-9_.+#-]*', text)
    return {w.lower() for w in words if len(w) >= 3 and w.lower() not in _STOPWORDS}


def filter_missing_skills(data: dict, vacancy_text: str, cv_text: str = "") -> None:
    """Verwijder missing_skills die:
    - niet voorkomen in de vacaturetekst, of
    - al aanwezig zijn in het CV of in matched_skills.
    """
    if "missing_skills" not in data:
        return

    vacancy_lower = vacancy_text.lower()
    cv_terms = _key_terms(cv_text)
    matched_terms = _key_terms(" ".join(data.get("matched_skills", [])))

    filtered = []
    for skill in data["missing_skills"]:
        # Skill moet (als geheel of via trefwoorden) in de vacature staan
        in_vacancy = skill.lower() in vacancy_lower or bool(
            _key_terms(skill) & _key_terms(vacancy_text)
        )
        if not in_vacancy:
            continue
        # Skill mag geen benefit/voordeel zijn
        if _key_terms(skill) & _BENEFIT_KEYWORDS:
            continue
        # Skill mag niet al op het CV of in matched_skills staan
        skill_terms = _key_terms(skill)
        if skill_terms & cv_terms or skill_terms & matched_terms:
            continue
        filtered.append(skill)

    data["missing_skills"] = filtered


def fix_salutation(data: dict, vacancy_text: str) -> None:
    """Vervang foutieve aanspreking, verwijder placeholders, voeg Betreft toe,
    en detecteer derde-persoons brieven."""
    if "motivation_letter" not in data:
        return

    letter = data["motivation_letter"]

    # 1. Derde persoon detecteren via naam uit match_text
    match_text = data.get("match_text", "")
    name_match = re.match(r'^([A-Z][a-z]+)', match_text)
    first_name = name_match.group(1) if name_match else ""
    is_third_person = bool(first_name) and bool(
        re.search(rf'\b{first_name}\b.{{0,30}}\b(heeft|is|werd|werkte|beschikt|brengt)\b', letter)
    ) and "Ik " not in letter
    if is_third_person:
        data["motivation_letter"] = (
            "⚠️ De motivatiebrief kon niet correct worden gegenereerd. "
            "Probeer opnieuw of pas de vacaturetekst aan."
        )
        return

    # 2. Foutieve aanspreking corrigeren
    has_contact = bool(re.search(
        r'\b(mevrouw|meneer|dhr\.|mevr\.)\s+[A-Z][a-z]+',
        vacancy_text
    ))
    if not has_contact:
        letter = re.sub(r'Geachte (mevrouw|meneer)[^,]*,', 'Beste,', letter)

    # 3. Placeholders verwijderen
    letter = re.sub(
        r'[^.!?\n]*\[[^\]]+\][^.!?\n]*[.!?]?\s*',
        '',
        letter
    ).strip()

    # 4. Betreft-regel toevoegen als die ontbreekt
    if not letter.startswith("Betreft:"):
        first_line = vacancy_text.strip().splitlines()[0].strip()
        letter = f"Betreft: {first_line}\n\n{letter}"

    data["motivation_letter"] = letter


async def process_match(vacancy_text: str, cv_file: UploadFile):
    """Process the match between the vacancy and the CV."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(cv_file.file, tmp)
        tmp_path = Path(tmp.name)

    try:
        # cv_content = plumb_text_from_pdf(tmp_path)
        cv_content = extract_with_pymupdf(tmp_path)

        print(f"Extracted CV content: {cv_content} --- STOPPED ---")
        if not cv_content.strip():
            raise HTTPException(status_code=400, detail="Invalid CV file")

        generated_prompt = generate_prompt(vacancy_text, cv_content)
        print(generated_prompt)
        response = chat(
            model='open-jobs:latest',
            messages=[{"role": "user", "content": generated_prompt}],
            options={"temperature": 0.2}
        )

        extracted_data = extract_json(response.message.content)
        fix_salutation(extracted_data, vacancy_text)
        filter_missing_skills(extracted_data, vacancy_text, cv_content)
        return extracted_data
    except Exception as e:
        raise HTTPException(status_code=500,
                            detail=f"Internal server error: {str(e)}") from e
    finally:
        if tmp_path.exists():
            tmp_path.unlink()
