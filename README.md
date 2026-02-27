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

## 📸 Project Evolution

Tijdens de ontwikkeling heb ik het project iteratief verbeterd.
Hieronder zie je de belangrijkste stappen.

### 1️⃣ Initial Upload Interface

![Screen 1](./screenshots/screen_1.png)

Eerste versie met basis PDF upload functionaliteit.

---

### 2️⃣ Job Description Input

![Screen 2](./screenshots/screen_2.png)

Toevoeging van vacature parsing.

---

### 3️⃣ AI Score Integration

![Screen 3A](./screenshots/screen_3a.png)
![Screen 3B](./screenshots/screen_3b.png)

Implementatie van match-percentage en JSON parsing.

---

### 4️⃣ Skill Gap Analysis

![Screen 4](./screenshots/screen_4.png)

Weergave van matched en missing skills.

---

### 5️⃣ Motivation Letter Generation

![Screen 5](./screenshots/screen_5.png)

Automatische motivatiebrief via LLM.

---

### 6️⃣ UI/UX Improvements & Theming

![Screen 6A](./screenshots/screen_6a.png)
![Screen 6B](./screenshots/screen_6b.png)

Responsive layout, theming en dashboard-structuur.

## 📝 Zelfreflectie

...
