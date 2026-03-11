# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OpenJob** is a full-stack AI-powered job matching tool. Users upload a PDF CV and paste a job description; the backend uses a local LLM (via Ollama) to compute a match score, extract matched/missing skills, and generate a Dutch-language VDAB-compliant cover letter. All LLM inference runs locally — no external AI API calls.

## Commands

### Backend (`oj_backend/`)

```bash
# Install dependencies (uses uv)
cd oj_backend
pip install -r requirements.txt

# Start dev server (hot reload) on http://localhost:8000
uvicorn main:app --reload

# Pull the required LLM model (prerequisite: Ollama must be running)
ollama pull deepseek-r1
```

### Frontend (`oj_frontend/`)

```bash
cd oj_frontend
npm install
npm run dev      # Dev server on http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

## Architecture

### Data Flow

1. Frontend (`app/page.tsx`) collects PDF upload + job description text
2. Sends `multipart/form-data` POST to `http://localhost:8000/match`
3. Backend (`main.py` → `utils.process_match`) saves PDF to temp file, extracts text via `services/pdf_plumber.py`
4. `utils.generate_prompt()` builds a Dutch-language system prompt with strict grounding rules
5. Ollama `deepseek-r1` model called via `ollama.chat()` with `temperature=0.2`
6. `utils.extract_json()` strips DeepSeek-R1's `<think>` blocks and parses JSON
7. Returns `MatchResponse` (Pydantic schema in `schemas.py`)
8. Frontend renders results: `ScoreCard`, `SkillsAnalysisCard`, `CoverLetterCard`

### Key Files

| File | Purpose |
|------|---------|

| `oj_backend/main.py` | FastAPI app; single `POST /match` endpoint |
| `oj_backend/utils.py` | Core logic: prompt generation, LLM call, JSON extraction |
| `oj_backend/schemas.py` | Pydantic `MatchResponse` model |
| `oj_backend/services/pdf_plumber.py` | PDF text extraction |
| `oj_frontend/app/page.tsx` | Main UI page with upload + results |
| `oj_frontend/components/results/` | Result display components (Score, Skills, CoverLetter) |
| `oj_frontend/components/upload/` | CV upload and job description input components |

### Backend Stack

- Python 3.12, FastAPI, uv (package manager)
- `ollama` client + `deepseek-r1` model (local inference)
- `pdfplumber` for PDF text extraction
- CORS restricted to `http://localhost:3000`

### Frontend Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, shadcn/ui components, Radix UI primitives
- Recharts for score visualization
- Path alias: `@/*` maps to the `oj_frontend/` root

### LLM Prompt Design

The prompt (`utils.generate_prompt`) is written entirely in Dutch and enforces:

- **Strict grounding**: only skills literally present in both texts count as matched
- **No placeholders**: if data is missing, rephrase naturally
- **Structured JSON output** with 5 fields: `match_percentage`, `matched_skills`, `missing_skills`, `motivation_letter`, `match_text`

`extract_json()` handles DeepSeek-R1's tendency to wrap output in `\`\`\`json` blocks or `<think>` sections.

## Notes

- No test suite exists in the current codebase
- The `fine-tune/` directory contains fine-tuning experiments (not part of the main app)
- `pyproject.toml` includes heavy ML dependencies (`unsloth`, `bitsandbytes`, `peft`, `trl`) for fine-tuning, not runtime inference
