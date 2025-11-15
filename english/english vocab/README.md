# 📘 JSON → Anki Vocabulary Import Guide

This guide explains how to convert a structured `words.json` file into a rich, memory-optimized Anki deck.

---

## ⚙️ 1. Overview

You’ll:

1. Convert JSON → CSV.
2. Create a custom **Vocabulary Rich** note type in Anki.
3. Import the CSV file.
4. Use high-UX front and back templates.

---

## 🧩 2. Create and Manage Note Type in Anki

1. Open **Anki (desktop)**.
2. Go to **Tools → Manage Note Types**.
3. Click **Add → Clone: Basic** → name it **Vocabulary Rich** → click **OK**.
4. Select your new type → click **Fields** → remove the existing ones.
5. Add the following fields **in this exact order**:

Word
Part of speech
Phon UK
Phon US
Core meaning
Literal meaning
Figurative meaning
Collocations
Example simple
Example intermediate
Example advanced
Synonyms
Antonyms
CEFR level
Mnemonic

pgsql
Copy code

6. Click **Cards…** → you’ll see _Front Template_ and _Back Template_.
7. Replace the existing content with the templates below.
8. Click **Close → Close** to save.

---

## 💻 3. Convert JSON → CSV

Save this file as `make_csv.js`:

```js
const fs = require("fs");

const inputFile = "words.json";
const outputFile = "anki_words.csv";

const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));
const esc = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';

const header = [
  "Word",
  "Part of speech",
  "Phon UK",
  "Phon US",
  "Core meaning",
  "Literal meaning",
  "Figurative meaning",
  "Collocations",
  "Example simple",
  "Example intermediate",
  "Example advanced",
  "Synonyms",
  "Antonyms",
  "CEFR level",
  "Mnemonic",
];

const rows = [header.map(esc).join(",")];

for (const item of data) {
  const level = item.examples?.by_level ?? {};

  const row = [
    item.word,
    item.part_of_speech,
    item.phonetics?.uk ?? "",
    item.phonetics?.us ?? "",
    item.core_meaning ?? "",
    item.literal_meaning ?? "",
    item.figurative_meaning ?? "",
    (item.collocations || []).join("; "),
    level.simple ?? "",
    level.intermediate ?? "",
    level.advanced ?? "",
    (item.synonyms || []).join("; "),
    (item.antonyms || []).join("; "),
    item.cefr_level ?? "",
    item.mnemonic ?? "",
  ];

  rows.push(row.map(esc).join(","));
}

fs.writeFileSync(outputFile, rows.join("\n"), "utf8");
console.log("✅ Wrote", outputFile);
```

Run:

```bash
node make_csv.js
```

This generates anki_words.csv.

📥 4. Import CSV into Anki
In Anki → File → Import… → select anki_words.csv.

Import Settings:

Note type: Vocabulary Rich

Deck: your target deck

Separator: Comma

Check “First row is field names”

Map columns → fields (in same order as defined above).

Import.

🎨 5. Card Templates
Front Template
html
Copy code

<div style="font-family: 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.5; color: #222; max-width: 600px; margin: auto; text-align: center;">

  <div style="font-size: 32px; font-weight: 700; color: #1a1a1a;">
    {{Word}}
  </div>

  <div style="font-size: 16px; color: #666; margin-top: 5px;">
    {{Part of speech}}
  </div>

  <div style="font-size: 14px; color: #888; margin-top: 3px;">
    <i>{{Phon UK}}</i> / <i>{{Phon US}}</i>
  </div>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0 15px 0; width: 70%;">

  <div style="font-size: 17px; color: #333;">
    <b style="color:#0073e6;">What does it mean?</b><br>
    <span style="font-size:15px; color:#666;">Think of core, literal, and figurative sense before flipping.</span>
  </div>

  <div style="margin-top: 25px; color: #999; font-size: 14px;">
    💡 Recall collocations or a short example sentence in your head.
  </div>
</div>
Back Template
html
Copy code
<div style="font-family: 'Segoe UI', Roboto, sans-serif; font-size: 17px; line-height: 1.5; color: #222; max-width: 600px; margin: auto; text-align: left;">

  <div style="font-size: 28px; font-weight: 700; color: #1a1a1a; text-align: center;">
    {{Word}}
  </div>

  <div style="text-align: center; font-size: 15px; color: #666;">
    {{Part of speech}} • <i>{{Phon UK}}</i> / <i>{{Phon US}}</i>
  </div>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0 15px 0;">

  <div><b style="color:#0073e6;">Core meaning:</b> {{Core meaning}}</div>
  <div><b style="color:#0073e6;">Literal meaning:</b> {{Literal meaning}}</div>
  <div><b style="color:#0073e6;">Figurative meaning:</b> {{Figurative meaning}}</div>

  <div style="margin-top: 12px;"><b style="color:#009966;">Collocations:</b> {{Collocations}}</div>

  <div style="margin-top: 12px;"><b style="color:#cc5500;">Examples:</b>
    <ul style="margin:5px 0 0 15px;">
      <li><b>Simple:</b> {{Example simple}}</li>
      <li><b>Intermediate:</b> {{Example intermediate}}</li>
      <li><b>Advanced:</b> {{Example advanced}}</li>
    </ul>
  </div>

  <div style="margin-top: 12px;"><b style="color:#9933cc;">Synonyms:</b> {{Synonyms}}</div>
  <div><b style="color:#9933cc;">Antonyms:</b> {{Antonyms}}</div>

  <div style="margin-top: 12px;"><b style="color:#cc0000;">Mnemonic:</b> <i>{{Mnemonic}}</i></div>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
  <div style="text-align: right; font-size: 13px; color: #777;">
    CEFR: {{CEFR level}}
  </div>
</div>
