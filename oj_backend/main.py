import json
import re
import tempfile
import shutil
from pathlib import Path
from turtle import title
from typing import Annotated, Dict, Any
from schemas import MatchResponse
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Services/Utils
from services.pdf_plumber import plumb_text_from_pdf
from ollama import chat, ChatResponse

app = FastAPI(title="OpenJob", description="AI-Powered Job Matching Tool")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# * --- Endpoints ---


@app.post("/match", response_model=MatchResponse)
async def match_job_to_cv(vacancy_text: Annotated[str, Form()],
                          cv_file: Annotated[UploadFile, File()]):
    """Compare a CV with a job description and return a JSON response
    with the match percentage, matched skills, missing skills, and motivation letter.

    Args:
        vacancy_text (Annotated[str, Form): The vacancy description text.
        cv_file (Annotated[UploadFile, File): The CV file.

    Returns:
        dict: A dictionary containing the match percentage,
        matched skills, missing skills, and motivation letter.
    """

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(cv_file.file, tmp)
        tmp_path = Path(tmp.name)

    try:
        cv_content = plumb_text_from_pdf(tmp_path)
        if not cv_content.strip():
            raise HTTPException(status_code=400, detail="Invalid CV file")

        generated_prompt = generate_prompt(vacancy_text, cv_content)

        response: ChatResponse = chat(
            model='deepseek-r1',
            messages=[{"role": "user", "content": generated_prompt}])

        extracted_data = extract_json(response.message.content)
        return extracted_data
    except Exception as e:
        raise HTTPException(status_code=500,
                            detail=f"Internal server error: {str(e)}") from e
    finally:
        if tmp_path.exists():
            tmp_path.unlink()

# * --- Utils ---

def generate_prompt(job_text: str, cv_text: str) -> str:
    """Build the LLM prompt that compares a CV with a job description.

    Args:
        job_text: The full text of the job description.
        cv_text: The full text of the candidate's CV.

    Returns:
        A formatted prompt string to send to the chat model.
    """
    return f"""
    STRENG GEHEIM: Vergelijk onderstaand CV met de Vacature.

    CV DATA:
    {cv_text}

    VACATURE DATA:
    {job_text}

    STAPPENPLAN VOOR AI:
    1. Geef een EXPLICIETE lijst van alle technologieën in het CV.
    2. Geef een EXPLICIETE lijst van alle technologieën in de vacature.
    3. Match deze (bijv. 'React.js' op CV = 'React' in vacature).
    4. Bereken de match: Hoeveel van de vereiste tech-skills heeft de kandidaat?
    5. Schrijf de brief.

    BELANGRIJK:
    - [KANDIDAAT] HEEFT ervaring met React, Node.js, SQL, NoSQL en Docker. Als de vacature hierom vraagt, is de match NIET 0%.
    - Noem in de brief de sterke punten van [KANDIDAAT] (bijv. zijn Microdegree in AI en zijn projecten met Kotlin/React Native).

    OUTPUT (ALLEEN JSON):
    {{
        "match_percentage": <int>,
        "matched_skills":["alleen skills die ECHT op het CV staan"],
        "missing_skills": ["alleen skills die ECHT niet op het CV staan"],
        "motivation_letter": "<brief namens [KANDIDAAT] die de match verklaart
                            en enthousiasme toont>",
        BELANGRIJK VOOR MOTIVATION LETTER:
            - Begin ALTIJD met een formele aanspreking.
            Bijvoorbeeld:
                "Geachte heer/mevrouw,"
            of als bedrijfsnaam bekend is:
                "Geachte recruiter van [BEDRIJFSNAAM],"

            - Eindig ALTIJD met een formele afsluiting:
                Bijvoorbeeld:
                    "Met vriendelijke groet,"
                    "[NAAM KANDIDAAT]"
            - Schrijf in de ik-vorm.
            - Geen placeholder tekst.
            - Geen extra uitleg buiten de brief.
      "match_text": "Geeft een gevoel van een definitieve conclusie of besluit (korte zin)."
      BELANGRIJK VOOR match_text:
            - Gebruik EXACT dit format:
                "[NAAM_KANDIDAAT] heeft een [Excellent | Good | Average | Low]
                match met de vacature."
            - Gebruik de naam zoals vermeld in het CV.
            - Gebruik EXACT één van deze woorden:
                Excellent (>= 80)
                Good (>= 65)
                Average (>= 50)
                Low (< 50)
            - Geen extra tekst.
            - Geen variaties.
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

# endregions
