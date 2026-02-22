import json
import re

from fastapi import FastAPI
from schemas import TargetJobRequest
from services.pdf_plumber import plumb_text_from_pdf
from ollama import chat, ChatResponse

app = FastAPI()
models = ["gemma3", "deepseek-r1"]
#region: endpoints
@app.get("/plumb")
def plumb_pdf():
    """ Extracts text from a PDF file and returns it as a dictionary.
    Returns:
        dict: A dictionary containing the extracted text from the PDF.
    """
    text = plumb_text_from_pdf("CV-Burak-M-Balci-2025_NL.pdf")
    return {"pdf_text": text}

@app.post("/match")
def match_job_to_cv(request: TargetJobRequest):
    generated_prompt = generate_prompt(request.text, "CV-Burak-M-Balci-2025_NL.pdf")
    response: ChatResponse = chat(model='deepseek-r1', messages=[{"role": "user", "content": generated_prompt}])

    return {"response": extract_json(response.message.content)}
#endregion

#region: utils
def generate_prompt(job_text: str, cv_text: str) -> str:
    prompt = f"""
    ### ROL
    Je bent een feitelijke AI-assistent voor recruiters. Je taak is het vergelijken van een CV met een vacature.
    Je mag NOOIT vaardigheden verzinnen die niet in de brontekst staan.

    ### BRONGEGEVENS
    [START CV]
    {cv_text}
    [EIND CV]

    [START VACATURE]
    {job_text}
    [EIND VACATURE]

    ### OPDRACHT
    1. Identificeer de naam van de kandidaat uit het CV.
    2. Lijst alle tech-skills uit de vacature op die NIET letterlijk in het CV staan[cite: 17, 19].
    3. Bereken een match_percentage (0-100).
    4. Schrijf een motivatiebrief vanuit de 'ik-persoon' (de kandidaat).

    ### STRIKTE INSTRUCTIES VOOR DE BRIEF
    - Gebruik ALLEEN programmeertalen en frameworks die in het CV staan vermeld (bijv. Java, Kotlin, Python, React).
    - Als de vacature vraagt om iets dat de kandidaat NIET heeft (bijv. Angular of Azure), schrijf dan: "Ik ben zeer gemotiveerd om mijn huidige kennis van [Skill van CV] uit te breiden naar [Gevraagde skill]".
    - NOOIT liegen: Zeg niet "Ik heb ervaring met X" als X niet in het CV staat.

    ### OUTPUT FORMAAT (JSON)
    Antwoord uitsluitend met JSON:
    {{
      "match_percentage": <int>,
      "missing_skills": ["<skill>", "<skill>"],
      "motivation_letter": "<tekst_in_het_nederlands>"
    }}
    """
    return prompt

def extract_json(json_text: str):
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

#endregions
