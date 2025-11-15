// make_csv.js
const fs = require("fs");

const inputFile = "./englishWords.json";
const outputFile = "anki_words.csv";

const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));

// Escape for CSV
const esc = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';

// Header row: must match the field names in Anki
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
console.log("Wrote", outputFile);
