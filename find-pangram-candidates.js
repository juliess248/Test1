// find-pangram-candidates.js
// Usage: node find-pangram-candidates.js dictionary.json
//
// Reads a wrangler D1 export (JSON) of your word list and finds
// Spelling-Bee-style puzzle candidates: words with exactly 7 unique
// letters that can serve as a pangram, plus every other dictionary
// word that can be spelled using only that letter set.

const fs = require('fs');

const WORD_COLUMN = 'word'; // <-- change this to match your actual column name
const MIN_SUBSET_LEN = 4;   // shortest word length to count as a "findable" word
const MIN_SUBSET_WORDS = 8; // don't bother with puzzles that have too few findable words
const MAX_SUBSET_WORDS = 30; // or too many (feels less special)

function normalize(word) {
  return word
    .toLowerCase()
    .normalize('NFC') // keep accented chars intact (é, ò, etc. are meaningful in Papiamentu)
    .trim();
}

function uniqueLetters(word) {
  return new Set(word.replace(/[^a-zA-Zàèìòùáéíóúñ]/g, '').split(''));
}

function isSubsetWord(word, letterSet) {
  return [...uniqueLetters(word)].every((ch) => letterSet.has(ch));
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: node find-pangram-candidates.js <dictionary.json>');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  // wrangler d1 --json wraps results like [{ results: [...] }]
  const rows = Array.isArray(raw) && raw[0]?.results ? raw[0].results : raw;

  const words = rows
    // KV key-list exports use "name" for the key (the word itself);
    // D1 exports use whatever column you set in WORD_COLUMN above.
    .map((row) => normalize(row.name || row[WORD_COLUMN] || ''))
    .filter((w) => w.length >= 4);

  const wordSet = new Set(words);

  // Candidates: words with exactly 7 unique letters, reasonable length (6-9)
  const candidates = [...wordSet].filter((w) => {
    const letters = uniqueLetters(w);
    return letters.size === 7 && w.length >= 6 && w.length <= 9;
  });

  const results = candidates.map((pangram) => {
    const letterSet = uniqueLetters(pangram);
    const findableWords = words.filter(
      (w) => w !== pangram && w.length >= MIN_SUBSET_LEN && isSubsetWord(w, letterSet)
    );
    const hasAccent = /[àèìòùáéíóúñ]/.test(pangram);
    const hasRepeatedLetter = pangram.length > letterSet.size;

    return {
      pangram,
      letterSet: [...letterSet].sort().join(''),
      findableWordCount: findableWords.length,
      findableWords: [...new Set(findableWords)].sort(),
      hasAccent,
      hasRepeatedLetter,
    };
  });

  const playable = results
    .filter((r) => r.findableWordCount >= MIN_SUBSET_WORDS && r.findableWordCount <= MAX_SUBSET_WORDS)
    // favor puzzles with accents or repeated letters -- these tend to look
    // "distinctively Papiamentu" per the TikTok criteria
    .sort((a, b) => {
      const score = (r) => (r.hasAccent ? 2 : 0) + (r.hasRepeatedLetter ? 1 : 0);
      return score(b) - score(a) || b.findableWordCount - a.findableWordCount;
    });

  console.log(`Found ${playable.length} playable pangram candidates out of ${candidates.length} total.\n`);
  playable.slice(0, 20).forEach((r) => {
    console.log(`★ ${r.pangram.toUpperCase()}  (letters: ${r.letterSet})`);
    console.log(`  ${r.findableWordCount} findable words | accent: ${r.hasAccent} | repeated letter: ${r.hasRepeatedLetter}`);
    console.log(`  e.g. ${r.findableWords.slice(0, 6).join(', ')}`);
    console.log('');
  });
}

main();
