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

2. **Local AI:**

    ```bash
    ollama pull deepseek-r1
    ```

3. **Frontend**

    ```bash
    cd oj_frontend
    npm install
    npm run dev
    ```

## 🛠 Project Evolution

Hieronder volgt een overzicht van de evolutie van **OpenJob**, van de eerste functionele bouwstenen tot de gepolijste AI-gedreven interface.

### 1. Core Layout & Input Architectuur

![Core Layout](screenshots/screen_1.png)

- **Beschrijving:** De basis van de applicatie met een focus op gestructureerde data-entry. Implementatie van een **PDF-Uploader** met bestandstype-validatie en een **Job Description Input** voorzien van een 'Paste Text' functionaliteit.
- **Focus:** UI-structuur en initiële component-architectuur.

### 2. Brand Identity & Navigatie

![Navbar & Logo](screenshots/screen_2.png)

- **Beschrijving:** Introductie van een gestroomlijnde navigatiebalk met 'Home' en 'How To Use' secties. De visuele identiteit is versterkt met een modern logo, wat bijdraagt aan de professionele uitstraling van de tool.
- **Focus:** Branding en Informatie-architectuur.

### 3. Analytics Dashboard & AI Logica

![Analytics Cards](screenshots/screen_3a.png)
![Skills Analysis](screenshots/screen_3b.png)

- **Beschrijving:** De overgang van een statische naar een functionele pagina. Introductie van dynamische kaarten voor de **Match Score** en een gedetailleerde **Skill Analysis**. Het systeem maakt nu onderscheid tussen 'Matched Skills' en 'Missing Skills' op basis van AI-extractie.
- **Focus:** Data-visualisatie en integratie van LLM-feedback.

### 4. Visuele Consistentie & Kleurbeheer

![Theming](screenshots/screen_4.png)

- **Beschrijving:** Verfijning van de UI door het doorvoeren van een consistent kleurenschema. De accentkleuren uit het logo zijn gebruikt om de visuele hiërarchie te versterken, waardoor de actieknop 'Analyze' en de status-badges beter opvallen.
- **Focus:** UX-design en kleurentheorie.

### 5. Generative Career Assets (Cover Letter)

![Cover Letter Generation](screenshots/screen_5.png)

- **Beschrijving:** Implementatie van de generatieve laag. Onder de analyse-sectie is een 'full-width' kaart toegevoegd waar de AI automatisch een op maat gemaakte motivatiebrief opstelt, direct gebaseerd op de matches in het CV.
- **Focus:** Generative AI (GenAI) en workflow-automatisering.

### 6. User Onboarding & Documentatie

![How To Use Page](screenshots/screen_6a.png)
![Detailed Guide](screenshots/screen_6b.png)

- **Beschrijving:** Voltooiing van de applicatie met een interactieve **How To Use** pagina. Deze sectie legt stap-voor-stap de technische werking uit, van de PDF-parsing tot de AI-interpretatie, om de gebruiker volledig te onboarden.
- **Focus:** User Enablement en technische transparantie.

## 📝 Zelfreflectie

...
