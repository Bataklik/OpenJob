# 🚀 OpenJob - AI-Powered Job Matching Tool

**OpenJob** is een full-stack applicatie die werkzoekenden helpt om hun CV direct te toetsen aan vacatureteksten. Door gebruik te maken van lokale LLM's (Large Language Models), analyseert de tool de match tussen vaardigheden en genereert het een gepersonaliseerde motivatiebrief.

## 🛠 Tech Stack

- **Frontend:** Next.js 16, TypeScript, shadcn/ui, Tailwind CSS.
- **Backend:** FastAPI (Python), PDFPlumber.
- **AI Engine:** Ollama (DeepSeek-R1 / Gemma3), Prompt Engineering.
- **Infrastructure:** Docker (containerization).

## 🧠 Hoe het werkt

1. **PDF Extraction:** De backend gebruikt `pdfplumber` om gestructureerde tekst uit geüploade CV's te halen.
2. **Context Grounding:** De AI krijgt zowel de CV-tekst als de vacaturetekst binnen via een strikt gedefinieerde 'system prompt'.
3. **Reasoning (DeepSeek-R1):** Het model analyseert overlappingen en hiaten in de tech-stack (bijv. herkent dat 'React.js' op het CV matcht met 'React' in de vacature).
4. **Structured Output:** De AI levert een JSON-response die door de frontend wordt vertaald naar een interactief dashboard.

## 📈 Technical Challenges & Reflection (AI & Data Engineering)

Tijdens de ontwikkeling van OpenJob heb ik verschillende uitdagingen aangepakt die direct aansluiten:

- **Hallucinatie Management:** Aanvankelijk verzon de AI skills (zoals Angular) die niet op het CV stonden. Ik heb dit opgelost door *Strict Grounding* in de prompt engineering toe te passen.
- **Local AI Inference:** Gekozen voor Ollama om data-privacy te waarborgen (CV-data verlaat de lokale machine niet) en om kosten te minimaliseren.
- **JSON Parsing:** Het filteren van de json-tags van DeepSeek-R1 om een valide JSON-response te garanderen voor de frontend.

## 🚀 Installatie

1. **Backend:**

   ```bash
   cd oj_backend
   pip install -r requirements.txt
   uvicorn main:app --reload
    ```
