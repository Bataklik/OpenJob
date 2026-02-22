from fastapi import FastAPI
from services.pdf_plumber import plumb_text_from_pdf
app = FastAPI()

@app.get("/")
def plumb_pdf():
    text = plumb_text_from_pdf("CV-Burak-M-Balci-2025_NL.pdf")
    return {"pdf_text": text}
