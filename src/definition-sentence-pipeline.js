// Palabra di Kòrsou — definition & example-sentence pipeline
//
// DEFINITION HIERARCHY:
//   1. PDF dictionary (pa_reverse_index.json) → Claude writes an English gloss
//      grounded in that entry → Google Translate turns it into Papiamentu.
//   2. Not in dictionary → Google Translate supplies the meaning directly
//      (Claude is skipped entirely in this fallback path).
//
// SENTENCE HIERARCHY:
//   1. Real sentence containing the word — tried across a cascade of Papiamentu
//      newspaper sources (extra.cw first, then gobiernu.cw as a free backup).
//      Each source gets a short timeout so an obscure word fails fast instead
//      of stalling the whole request.
//   2. Not found anywhere → Google Translate generates a sentence (not Claude).

// --------------------------------------------------------------------------
// 1. DEFINITION PIPELINE
// --------------------------------------------------------------------------

async function getDefinition(word, env) {
  const w = word.toLowerCase();
  const dictEntry = env.PA_REVERSE_INDEX[w]; // array of {nl, gloss} or undefined

  if (dictEntry && dictEntry.length) {
    // Step 1: Claude writes an English definition grounded in the dictionary entry
    const englishDefinition = await claudeRefineDefinition(word, dictEntry, env);

    // Step 2: Google Translate converts that English text to Papiamentu
    const papiamentuDefinition = await googleTranslate(englishDefinition, "en", "pap", env);

    return {
      word,
      source: "pdf-dictionary+claude+google-translate",
      english: englishDefinition,
      papiamentu: papiamentuDefinition,
    };
  }

  // Fallback: word isn't in the dictionary — Google Translate handles it alone
  const fallbackTranslation = await googleTranslate(word, "pap", "en", env);
  return {
    word,
    source: "google-translate-fallback",
    english: fallbackTranslation,
    papiamentu: null, // no dictionary-grounded PA phrasing exists here
  };
}

async function claudeRefineDefinition(word, dictEntry, env) {
  const dutchWords = [...new Set(dictEntry.map(d => d.nl))];
  const glosses = dictEntry.map(d => d.gloss).join("; ");

  const prompt = `The Papiamentu word "${word}" corresponds to the Dutch word(s): ${dutchWords.join(", ")}.
Dictionary context (Dutch-Papiamentu entries): ${glosses}

Write a single, clear, concise English definition of "${word}" suitable for a word-game player.
Return ONLY the definition text, nothing else — no preamble, no quotes.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const textBlock = data.content.find(b => b.type === "text");
  return textBlock ? textBlock.text.trim() : null;
}

// --------------------------------------------------------------------------
// 2. EXAMPLE SENTENCE PIPELINE
// --------------------------------------------------------------------------

// Cascade of sources to try, in order. Each entry needs a way to (a) search
// for the word and get an article URL, and (b) know the article-link pattern
// on that site. Add/remove sources here without touching the calling code.
const NEWSPAPER_SOURCES = [
  {
    name: "extra.cw",
    searchUrl: (word) => `https://extra.cw/?s=${encodeURIComponent(word)}`,
    linkPattern: /<a[^>]+href="(https:\/\/extra\.cw\/[^"]+)"[^>]*rel="bookmark"/i,
  },
  {
    name: "gobiernu.cw",
    searchUrl: (word) => `https://gobiernu.cw/?s=${encodeURIComponent(word)}`,
    linkPattern: /<a[^>]+href="(https:\/\/gobiernu\.cw\/[^"]+)"[^>]*>/i,
  },
  // Vigilante (vigilantekorsou.news) mostly paywalls content behind login —
  // only its "Notisia Gratis" category is open. Worth adding here later if
  // extra.cw + gobiernu.cw miss often enough to justify it:
  // {
  //   name: "vigilantekorsou.news",
  //   searchUrl: (word) => `https://vigilantekorsou.news/?s=${encodeURIComponent(word)}`,
  //   linkPattern: /<a[^>]+href="(https:\/\/vigilantekorsou\.news\/[^"]+)"[^>]*>/i,
  // },
];

const PER_SOURCE_TIMEOUT_MS = 3500;

async function getExampleSentence(word, env) {
  for (const source of NEWSPAPER_SOURCES) {
    const sentence = await findSentenceOnSource(word, source).catch(() => null);
    if (sentence) {
      return { word, source: source.name, sentence };
    }
  }

  // Nothing found in any newspaper source — Google Translate generates a sentence
  const generated = await googleTranslateGenerateSentence(word, env);
  return { word, source: "google-translate-generated", sentence: generated };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = PER_SOURCE_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function findSentenceOnSource(word, source) {
  const res = await fetchWithTimeout(source.searchUrl(word), {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PalabraDiKorsouBot/1.0)" },
  });
  if (!res.ok) return null;

  const html = await res.text();
  const articleMatch = html.match(source.linkPattern);
  if (!articleMatch) return null;

  const articleRes = await fetchWithTimeout(articleMatch[1]);
  if (!articleRes.ok) return null;
  const articleHtml = await articleRes.text();

  const text = articleHtml
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  const wordRe = new RegExp(`\\b${word}\\b`, "i");
  const sentences = text.split(/(?<=[.!?])\s+/);
  const match = sentences.find(s => wordRe.test(s) && s.length < 300);

  return match ? match.trim() : null;
}

// --------------------------------------------------------------------------
// 3. GOOGLE TRANSLATE HELPERS (adjust to whatever client/API key setup you already use)
// --------------------------------------------------------------------------

async function googleTranslate(text, sourceLang, targetLang, env) {
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${env.GOOGLE_TRANSLATE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: sourceLang, target: targetLang, format: "text" }),
    }
  );
  const data = await res.json();
  return data?.data?.translations?.[0]?.translatedText ?? null;
}

async function googleTranslateGenerateSentence(word, env) {
  // Google Translate itself doesn't "generate" sentences — the practical approach
  // is: translate a simple English template sentence containing the word into Papiamentu.
  const template = `Here is an example: I used the word "${word}" in a sentence today.`;
  return googleTranslate(template, "en", "pap", env);
}

export { getDefinition, getExampleSentence };