"""
Voeg een nieuw gegenereerd entry toe aan train_dataset.json.
Plak de JSON van claude.ai in de RAW_ENTRY variabele hieronder en run het script.
"""
import json
from collections import Counter

# ── Plak hier de JSON output van claude.ai ────────────────────────────────────
RAW_ENTRY = """

"""
# ─────────────────────────────────────────────────────────────────────────────

def get_bucket(p):
    if p >= 80: return "PERFECTE"
    if p >= 60: return "GOEDE"
    if p >= 40: return "GEMIDDELDE"
    return "LAGE"

def build_input(cv_text: str, job_text: str, template_footer: str) -> str:
    return (
        "Je bent een uiterst kritische AI Recruiter. Je doel is een eerlijke vergelijking te maken "
        "tussen het CV en de Vacature en een motivatiebrief te schrijven volgens de VDAB-normen.\r\n\r\n"
        "---\r\nVACATURE:\r\n" + job_text + "\r\n\r\n"
        "---\r\nCV:\r\n" + cv_text + "\r\n---\r\n" + template_footer
    )

def main():
    raw = json.loads(RAW_ENTRY.strip())

    cv_text  = raw["cv_text"]
    job_text = raw["job_text"]
    output   = raw["output"]
    pct      = output["match_percentage"]

    # Haal de vaste footer uit bestaand entry
    train = json.load(open("train_dataset.json"))
    template  = train[0]["input"]
    footer_start = template.find("STRIKTE ANALYSE")
    footer = "\r\n" + template[footer_start:]

    new_entry = {
        "input":  build_input(cv_text, job_text, footer),
        "output": output,
    }

    train.append(new_entry)
    json.dump(train, open("train_dataset.json", "w"), ensure_ascii=False, indent=2)

    dist = Counter(get_bucket(e["output"]["match_percentage"]) for e in train)
    print(f"✓ Entry toegevoegd ({pct}% — {get_bucket(pct)}). Totaal: {len(train)} entries")
    print(f"  PERFECTE={dist['PERFECTE']} GOEDE={dist['GOEDE']} GEMIDDELDE={dist['GEMIDDELDE']} LAGE={dist['LAGE']}")

if __name__ == "__main__":
    main()
