import fitz # PyMuPDF
from pathlib import Path

def extract_with_pymupdf(pdf_path: Path) -> str:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    return text
