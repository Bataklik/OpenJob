"""
Converteert train_dataset.json van:
  { "input": "<grote string>", "output": {...} }
naar:
  { "input": { "vacature": "...", "cv": "..." }, "output": {...} }
"""
import json
from pathlib import Path

DS = Path("train_dataset.json")
data = json.load(DS.open())

errors = []

for i, entry in enumerate(data):
    inp = entry["input"]

    # Sla entries over die al geconverteerd zijn
    if isinstance(inp, dict):
        continue

    try:
        # Split op ---\r\nVACATURE:\r\n
        _, rest = inp.split("---\r\nVACATURE:\r\n", 1)

        # Split op ---\r\nCV:\r\n (met 1 of 2 \r\n ervoor)
        parts = rest.split("---\r\nCV:\r\n", 1)
        vacature = parts[0].rstrip("\r\n")
        rest = parts[1]

        # CV eindigt op ---\r\n (begin van de footer)
        cv, _ = rest.split("\r\n---\r\n", 1)

        entry["input"] = {
            "vacature": vacature.strip(),
            "cv": cv.strip(),
        }

    except ValueError as e:
        errors.append((i, str(e)))

if errors:
    print(f"⚠️  {len(errors)} entries konden niet worden geconverteerd:")
    for idx, msg in errors:
        print(f"  Entry {idx}: {msg}")
else:
    json.dump(data, DS.open("w"), ensure_ascii=False, indent=2)
    print(f"✓ {len(data)} entries geconverteerd naar {{ vacature, cv }} formaat.")
