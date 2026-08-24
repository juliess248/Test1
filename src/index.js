import { WorkerEntrypoint } from "cloudflare:workers";

export default class extends WorkerEntrypoint {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/auth/signup" && request.method === "POST") {
      return this.handleSignup(request);
    }
    if (url.pathname === "/api/auth/signin" && request.method === "POST") {
      return this.handleSignin(request);
    }
    if (url.pathname === "/api/leaderboard" && request.method === "GET") {
      return this.handleLeaderboardGet(request);
    }
    if (url.pathname === "/api/leaderboard" && request.method === "POST") {
      return this.handleLeaderboardPost(request);
    }
    if (url.pathname === "/api/feedback" && request.method === "POST") {
      return this.handleFeedbackPost(request);
    }
    if (url.pathname === "/api/define" && request.method === "GET") {
      return this.handleDefine(request);
    }

    const assetResponse = await this.env.ASSETS.fetch(request);
    const contentType = assetResponse.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      return new HTMLRewriter()
        .on("head", {
          element(element) {
            element.append(AUTH_CSS, { html: true });
          },
        })
        .on(".header-actions", {
          element(element) {
            element.append(AUTH_ICON_HTML, { html: true });
          },
        })
        .on("body", {
          element(element) {
            element.append(AUTH_MODAL_HTML, { html: true });
          },
        })
        .transform(assetResponse);
    }

    return assetResponse;
  }

  async ensureLeaderboardTable() {
    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS leaderboard_scores (
          player_id TEXT NOT NULL,
          name TEXT NOT NULL,
          date TEXT NOT NULL,
          score INTEGER NOT NULL DEFAULT 0,
          words INTEGER NOT NULL DEFAULT 0,
          pangrams INTEGER NOT NULL DEFAULT 0,
          max_score INTEGER NOT NULL DEFAULT 0,
          updated_at TEXT DEFAULT (datetime('now')),
          PRIMARY KEY (player_id, date)
        )`
      )
      .run();
  }

  async handleLeaderboardGet(request) {
    try {
      await this.ensureLeaderboardTable();
      const url = new URL(request.url);
      const date = url.searchParams.get("date");
      if (!date) {
        return json({ error: "date query param required" }, 400);
      }

      const today = await this.env.GAME_HISTORY
        .prepare(
          `SELECT player_id AS playerId, name, score, words, pangrams
           FROM leaderboard_scores
           WHERE date = ?
           ORDER BY score DESC
           LIMIT 100`
        )
        .bind(date)
        .all();

      const allTime = await this.env.GAME_HISTORY
        .prepare(
          `SELECT
             l1.player_id AS playerId,
             (SELECT name FROM leaderboard_scores l2
                WHERE l2.player_id = l1.player_id
                ORDER BY date DESC LIMIT 1) AS name,
             SUM(l1.score) AS score,
             COUNT(DISTINCT l1.date) AS days
           FROM leaderboard_scores l1
           GROUP BY l1.player_id
           ORDER BY score DESC
           LIMIT 100`
        )
        .all();

      return json({
        today: today.results || [],
        allTime: allTime.results || [],
      }, 200);
    } catch (e) {
      return json({ error: "Server error" }, 500);
    }
  }

  async handleLeaderboardPost(request) {
    try {
      await this.ensureLeaderboardTable();
      const { playerId, name, date, score, words, pangrams, maxScore } =
        await request.json();

      if (!playerId || !name || !date) {
        return json({ error: "playerId, name, and date required" }, 400);
      }

      await this.env.GAME_HISTORY
        .prepare(
          `INSERT INTO leaderboard_scores
             (player_id, name, date, score, words, pangrams, max_score)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(player_id, date) DO UPDATE SET
             name = excluded.name,
             score = excluded.score,
             words = excluded.words,
             pangrams = excluded.pangrams,
             max_score = excluded.max_score,
             updated_at = datetime('now')`
        )
        .bind(
          playerId,
          name,
          date,
          score || 0,
          words || 0,
          pangrams || 0,
          maxScore || 0
        )
        .run();

      const today = await this.env.GAME_HISTORY
        .prepare(
          `SELECT player_id AS playerId, name, score, words, pangrams
           FROM leaderboard_scores
           WHERE date = ?
           ORDER BY score DESC
           LIMIT 100`
        )
        .bind(date)
        .all();

      const allTime = await this.env.GAME_HISTORY
        .prepare(
          `SELECT
             l1.player_id AS playerId,
             (SELECT name FROM leaderboard_scores l2
                WHERE l2.player_id = l1.player_id
                ORDER BY date DESC LIMIT 1) AS name,
             SUM(l1.score) AS score,
             COUNT(DISTINCT l1.date) AS days
           FROM leaderboard_scores l1
           GROUP BY l1.player_id
           ORDER BY score DESC
           LIMIT 100`
        )
        .all();

      return json({
        today: today.results || [],
        allTime: allTime.results || [],
      }, 200);
    } catch (e) {
      return json({ error: "Server error" }, 500);
    }
  }

  async ensureFeedbackTable() {
    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS feedback (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_id TEXT,
          name TEXT,
          category TEXT,
          message TEXT NOT NULL,
          date TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        )`
      )
      .run();
  }

  async handleFeedbackPost(request) {
    try {
      await this.ensureFeedbackTable();
      const { playerId, name, category, message, date } =
        await request.json();

      const text = (message || "").trim();

      if (!text) {
        return json({ error: "Skirbi algu prome ku manda" }, 400);
      }
      if (text.length > 2000) {
        return json({ error: "Komentario muy largu" }, 400);
      }

      await this.env.GAME_HISTORY
        .prepare(
          `INSERT INTO feedback
             (player_id, name, category, message, date)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(
          playerId || null,
          name || null,
          category || null,
          text,
          date || null
        )
        .run();

      return json({ ok: true }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.ensureFeedbackTable();
        return this.handleFeedbackPost(request);
      }
      return json({ error: "Server error" }, 500);
    }
  }

  async ensureGlossaryTable() {
    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS word_glossary (
          word TEXT PRIMARY KEY,
          display TEXT,
          tags TEXT,
          definition TEXT,
          example TEXT,
          english TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        )`
      )
      .run();
  }

  /*
    Auto-writes the glossary as new words show up in puzzles.
    On first request for a word, this calls Claude to draft a
    definition/example/gloss, then caches the result in D1 —
    every request after that (any player, any day) is a plain
    cache read and never calls the model again.
  */
  async handleDefine(request) {
    try {
      await this.ensureGlossaryTable();

      const url = new URL(request.url);
      const word = (url.searchParams.get("word") || "")
        .trim()
        .toLowerCase();
      const display = url.searchParams.get("display") || word;

      if (!word || !/^[a-zñ]+$/.test(word)) {
        return json({ error: "Palabra inválido" }, 400);
      }

      const cached = await this.env.GAME_HISTORY
        .prepare(
          `SELECT display, tags, definition, example, english
           FROM word_glossary WHERE word = ?`
        )
        .bind(word)
        .first();

      if (cached) {
        return json({ word, ...cached, cached: true }, 200);
      }

      if (!this.env.ANTHROPIC_API_KEY) {
        return json({ error: "Definishon no ta disponibel awor aki" }, 503);
      }

      const generated = await this.generateDefinition(word, display);

      await this.env.GAME_HISTORY
        .prepare(
          `INSERT INTO word_glossary
             (word, display, tags, definition, example, english)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(word) DO NOTHING`
        )
        .bind(
          word,
          generated.display || display,
          generated.tags || null,
          generated.definition || null,
          generated.example || null,
          generated.english || null
        )
        .run();

      return json({ word, ...generated, cached: false }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.ensureGlossaryTable();
        return this.handleDefine(request);
      }
      return json({ error: "Server error" }, 500);
    }
  }

  async generateDefinition(word, display) {
    const prompt =
      `Palabra na Papiamentu: "${display}" (normalisá: "${word}").\n\n` +
      `Duna SOLAMENTE un ophèto JSON, sin markdown, sin fensu di código, ` +
      `ku e siguiente kamponan:\n` +
      `- "tags": kódigo(nan) gramatikal separá pa koma, usando SOLAMENTE ` +
      `e letternan: s (sustantivo), v (verbo), a (athetivo), r (atverbio), ` +
      `i (interhekshon). Por ehèmpel "s" òf "v,a".\n` +
      `- "definition": un splikashon kòrtiku, informal, na Papiamentu ` +
      `(1-2 frase), manera un hende lokal lo splika e palabra na un ` +
      `otro hende, no komo un dikshonario ofisial.\n` +
      `- "example": un frase natural na Papiamentu ku usa e palabra.\n` +
      `- "english": un tradukshon òf deskripshon kòrtiku na Ingles ` +
      `(un par di palabra).\n\n` +
      `Si bo no ta rekonosé e palabra komo un palabra real na ` +
      `Papiamentu, laga "definition" bashí ("").`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error("Model request failed");
    }

    const data = await response.json();
    const text = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim()
      .replace(/^```(json)?/i, "")
      .replace(/```$/, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {};
    }

    return {
      display: (parsed.display || display || word).slice(0, 60),
      tags: (parsed.tags || "").slice(0, 20),
      definition: (parsed.definition || "").slice(0, 500),
      example: (parsed.example || "").slice(0, 300),
      english: (parsed.english || "").slice(0, 200),
    };
  }

  async ensureUsersTable() {
    await this.env.GAME_HISTORY
      .prepare(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))"
      )
      .run();

    /*
      Idempotent: adding a column that already exists throws,
      which we just swallow. This lets existing deployments
      (with plaintext-only rows) pick up the new salt column
      without a manual migration step.
    */
    try {
      await this.env.GAME_HISTORY
        .prepare("ALTER TABLE users ADD COLUMN salt TEXT")
        .run();
    } catch {
      // column already exists
    }
  }

  randomHex(byteLength) {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async hashPassword(password, salt) {
    const data = new TextEncoder().encode(salt + password);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async handleSignup(request) {
    try {
      await this.ensureUsersTable();

      const { username, password } = await request.json();
      if (!username || !password) {
        return json({ error: "Username and password required" }, 400);
      }
      if (password.length < 4) {
        return json({ error: "Password must be at least 4 characters" }, 400);
      }
      const existing = await this.env.GAME_HISTORY
        .prepare("SELECT username FROM users WHERE username = ?")
        .bind(username)
        .first();
      if (existing) {
        return json({ error: "Username already taken" }, 409);
      }

      const salt = this.randomHex(16);
      const hashed = await this.hashPassword(password, salt);

      await this.env.GAME_HISTORY
        .prepare("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)")
        .bind(username, hashed, salt)
        .run();

      return json({ username }, 200);
    } catch (e) {
      return json({ error: "Server error" }, 500);
    }
  }

  async handleSignin(request) {
    try {
      await this.ensureUsersTable();

      const { username, password } = await request.json();
      if (!username || !password) {
        return json({ error: "Username and password required" }, 400);
      }

      const row = await this.env.GAME_HISTORY
        .prepare("SELECT username, password, salt FROM users WHERE username = ?")
        .bind(username)
        .first();

      if (!row) {
        return json({ error: "Invalid username or password" }, 401);
      }

      let valid = false;

      if (row.salt) {
        const hashed = await this.hashPassword(password, row.salt);
        valid = hashed === row.password;
      } else {
        /*
          Legacy row from before hashing was added — this
          account's "password" column is still plaintext.
          If it matches, migrate it to a salted hash right
          now so the plaintext value never gets written or
          read again after this one comparison.
        */
        valid = password === row.password;

        if (valid) {
          const salt = this.randomHex(16);
          const hashed = await this.hashPassword(password, salt);

          await this.env.GAME_HISTORY
            .prepare("UPDATE users SET password = ?, salt = ? WHERE username = ?")
            .bind(hashed, salt, username)
            .run();
        }
      }

      if (!valid) {
        return json({ error: "Invalid username or password" }, 401);
      }

      return json({ username: row.username }, 200);
    } catch (e) {
      return json({ error: "Server error" }, 500);
    }
  }
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const AUTH_CSS = `<style>
#cf-account-wrap{
  position:relative;
  display:flex;
  align-items:center;
}
#cf-account-btn svg{width:18px;height:18px;display:block;}
#cf-account-btn.signed-in{
  background:var(--flag);
  border-color:var(--flag);
  color:var(--ink-fixed);
}
#cf-account-popover{
  display:none;
  position:absolute;
  top:calc(100% + 8px);
  right:0;
  min-width:150px;
  background:var(--bg);
  border:1px solid var(--line);
  border-radius:12px;
  padding:12px;
  box-shadow:0 12px 30px rgba(0,0,0,.25);
  z-index:10000;
}
#cf-account-popover.open{display:block;}
.cf-popover-name{
  font-family:'Karla',sans-serif;
  font-size:13px;
  font-weight:700;
  color:var(--ink);
  margin-bottom:10px;
  white-space:nowrap;
}
.cf-logout-btn{
  border:1px solid var(--line);
  background:transparent;
  border-radius:11px;
  color:var(--dim);
  cursor:pointer;
  font-family:'Karla',sans-serif;
  font-size:12px;
  font-weight:700;
  padding:8px 12px;
  width:100%;
}
#cf-auth-overlay{
  display:none;
  position:fixed;
  inset:0;
  z-index:9999;
  background:rgba(8,31,54,.55);
  backdrop-filter:blur(4px);
  align-items:center;
  justify-content:center;
  padding:20px;
}
#cf-auth-overlay.open{display:flex;}
.cf-auth-dialog{
  position:relative;
  width:100%;
  max-width:360px;
  background:var(--bg);
  border:1px solid var(--line);
  border-radius:18px;
  padding:20px;
  box-shadow:0 20px 60px rgba(0,0,0,.35);
}
.cf-auth-close{
  position:absolute;
  top:12px;
  right:12px;
  width:28px;
  height:28px;
  border-radius:50%;
  border:1px solid var(--line);
  background:transparent;
  color:var(--ink);
  font-size:16px;
  line-height:1;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
}
.cf-auth-error{
  color:var(--no);
  font-size:12px;
  margin-bottom:10px;
  display:none;
}
.cf-auth-fields{
  display:flex;
  flex-direction:column;
  gap:10px;
  margin-bottom:12px;
}
</style>`;

const AUTH_ICON_HTML = `
<span id="cf-account-wrap">
  <button id="cf-account-btn" class="header-btn" aria-label="Kuenta">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  </button>
  <div id="cf-account-popover">
    <div class="cf-popover-name" id="cf-popover-name"></div>
    <button class="cf-logout-btn" id="cf-logout-btn" type="button">Sali</button>
  </div>
</span>`;

const AUTH_MODAL_HTML = `
<div id="cf-auth-overlay">
  <div class="cf-auth-dialog">
    <button class="cf-auth-close" id="cf-auth-close" aria-label="Sera">&times;</button>
    <div class="auth-title" id="cf-auth-title">Drenta</div>
    <div class="auth-intro">Ku un kuenta bo progreso ta keda wardá i bo por sigui hunga ku e mesun score riba tur bo aparatonan.</div>
    <div class="cf-auth-error" id="cf-auth-error"></div>
    <form id="cf-auth-form" class="cf-auth-fields">
      <input class="name-input" id="cf-auth-username" type="text" autocomplete="username" placeholder="Bo nòmber di uzuario" required>
      <input class="name-input" id="cf-auth-password" type="password" autocomplete="current-password" placeholder="Kontraseña" required>
      <button class="auth-submit" type="submit">Sigui</button>
    </form>
    <div class="auth-links">
      <button class="auth-link" id="cf-auth-toggle" type="button">No tin kuenta? Krea un</button>
    </div>
  </div>
</div>
<script>(function(){
  var openBtn=document.getElementById('cf-account-btn'),
      popover=document.getElementById('cf-account-popover'),
      popoverName=document.getElementById('cf-popover-name'),
      logoutBtn=document.getElementById('cf-logout-btn'),
      overlay=document.getElementById('cf-auth-overlay'),
      closeBtn=document.getElementById('cf-auth-close'),
      title=document.getElementById('cf-auth-title'),
      form=document.getElementById('cf-auth-form'),
      toggle=document.getElementById('cf-auth-toggle'),
      errorEl=document.getElementById('cf-auth-error'),
      mode='signin';

  function setMode(m){
    mode=m;
    title.textContent = m==='signin' ? 'Drenta' : 'Krea kuenta';
    toggle.textContent = m==='signin' ? 'No tin kuenta? Krea un' : 'Bo tin kuenta kaba? Drenta';
    errorEl.style.display='none';
  }

  function openModal(){ setMode('signin'); overlay.classList.add('open'); }
  function closeModal(){ overlay.classList.remove('open'); }
  function closePopover(){ popover.classList.remove('open'); }

  function setSignedIn(username){
    openBtn.dataset.user = username;
    openBtn.classList.add('signed-in');
    openBtn.setAttribute('aria-label', username);
    popoverName.textContent = username;
  }

  function setSignedOut(){
    delete openBtn.dataset.user;
    openBtn.classList.remove('signed-in');
    openBtn.setAttribute('aria-label', 'Kuenta');
    closePopover();
    localStorage.removeItem('cf_user');
  }

  openBtn.addEventListener('click', function(e){
    e.stopPropagation();
    if(openBtn.dataset.user){
      popover.classList.toggle('open');
    }else{
      openModal();
    }
  });
  document.addEventListener('click', function(e){
    if(!popover.contains(e.target) && e.target!==openBtn){
      closePopover();
    }
  });
  logoutBtn.addEventListener('click', setSignedOut);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) closeModal(); });
  toggle.addEventListener('click', function(){ setMode(mode==='signin' ? 'signup' : 'signin'); });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var u=document.getElementById('cf-auth-username').value,
        p=document.getElementById('cf-auth-password').value;
    errorEl.style.display='none';
    fetch('/api/auth/'+mode,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username:u,password:p})
    }).then(function(r){return r.json();}).then(function(d){
      if(d.error){
        errorEl.textContent=d.error;
        errorEl.style.display='block';
      }else{
        localStorage.setItem('cf_user', d.username);
        setSignedIn(d.username);
        closeModal();
      }
    }).catch(function(){
      errorEl.textContent='Error di konekshon';
      errorEl.style.display='block';
    });
  });

  var saved=localStorage.getItem('cf_user');
  if(saved){
    setSignedIn(saved);
  }
})();</script>`;