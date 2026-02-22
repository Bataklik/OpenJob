import pdfplumber
from pathlib import Path

def plumb_text_from_pdf(pdf_path: Path) -> str:
    path = Path(pdf_path)

    if not path.is_file():
        raise FileNotFoundError(f"File not found: {pdf_path}")

    pdf_text = ""

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                pdf_text += text + "\n"

    return pdf_text
