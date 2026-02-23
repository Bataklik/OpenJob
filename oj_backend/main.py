import json
import re
from fastapi import FastAPI
from schemas import MatchRequest
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
def match_job_to_cv(request: MatchRequest):
    cv_content = request.cv_text
    job_content = request.vacancy_text

    generated_prompt = generate_prompt(job_content, cv_content)

    llm_response: ChatResponse = chat(
        model='deepseek-r1',
        messages=[{"role": "user","content": generated_prompt}])

    extracted_data = extract_json(llm_response.message.content)
    return {"response": extracted_data}
#endregion

#region: utils
def generate_prompt(job_text: str, cv_text: str) -> str:
    return f"""
    STRENG GEHEIM: Vergelijk onderstaand CV met de Vacature.

    CV DATA:
    {cv_text}

    VACATURE DATA:
    {job_text}

    STAPPENPLAN VOOR AI:
    1. Scan het CV op programmeertalen en frameworks.
    2. Scan de vacature op vereiste technologieën.
    3. Match deze (bijv. 'React.js' op CV = 'React' in vacature).
    4. Bereken de match: Hoeveel van de vereiste tech-skills heeft de kandidaat?
    5. Schrijf de brief.

    BELANGRIJK:
    - [KANDIDAAT] HEEFT ervaring met React, Node.js, SQL, NoSQL en Docker. Als de vacature hierom vraagt, is de match NIET 0%.
    - Noem in de brief de sterke punten van [KANDIDAAT] (bijv. zijn Microdegree in AI en zijn projecten met Kotlin/React Native).

    OUTPUT (ALLEEN JSON):
    {{
      "match_percentage": <int>,
      "missing_skills": ["alleen skills die ECHT niet op het CV staan"],
      "motivation_letter": "<brief namens [KANDIDAAT] die de match verklaart en enthousiasme toont>"
    }}
    """

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
