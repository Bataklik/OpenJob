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
    """Categoriseer de match percentage in buckets."""
    if p >= 80: return "PERFECTE"
    if p >= 60: return "GOEDE"
    if p >= 40: return "GEMIDDELDE"
    return "LAGE"

def add_entry(raw: object):
    """ Voeg een nieuw entry toe aan train_dataset.json op basis van de raw input. """
    cv_text  = raw["cv_text"]
    job_text = raw["job_text"]
    output   = raw["output"]
    pct      = output["match_percentage"]

    train = json.load(open("train_dataset.json"))

    new_entry = {
        "input": {
            "vacature": job_text,
            "cv":       cv_text,
        },
        "output": output,
    }

    train.append(new_entry)
    json.dump(train, open("train_dataset.json", "w"), ensure_ascii=False, indent=2)

    dist = Counter(get_bucket(e["output"]["match_percentage"]) for e in train)
    print(f"✓ Entry toegevoegd ({pct}% — {get_bucket(pct)}). Totaal: {len(train)} entries")
    print(f"  PERFECTE={dist['PERFECTE']} GOEDE={dist['GOEDE']} GEMIDDELDE={dist['GEMIDDELDE']} LAGE={dist['LAGE']}")



def extract_raw_entries():
    """ Extract JSON array van de raw string, indien er meerdere entries in staan. """
    entries = json.loads(RAW_ENTRY)
    return entries

def main():
    """ Main functie om een entry toe te voegen aan train_dataset.json. """
    entries = extract_raw_entries()
    if not entries:
        print("Geen geldige JSON-entry gevonden in RAW_ENTRY.")
        return
    for i, entry in enumerate(entries):
        print(f"Verwerken entry {i+1}/{len(entries)}...")
        add_entry(entry)


if __name__ == "__main__":
    main()
