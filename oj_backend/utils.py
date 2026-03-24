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
        return extracted_data
    except Exception as e:
        raise HTTPException(status_code=500,
                            detail=f"Internal server error: {str(e)}") from e
    finally:
        if tmp_path.exists():
            tmp_path.unlink()
