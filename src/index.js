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

  async handleSignup(request) {
    try {
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
      await this.env.GAME_HISTORY
        .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
        .bind(username, password)
        .run();
      return json({ username }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.env.GAME_HISTORY
          .prepare(
            "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))"
          )
          .run();
        return this.handleSignup(request);
      }
      return json({ error: "Server error" }, 500);
    }
  }

  async handleSignin(request) {
    try {
      const { username, password } = await request.json();
      if (!username || !password) {
        return json({ error: "Username and password required" }, 400);
      }
      const user = await this.env.GAME_HISTORY
        .prepare("SELECT username FROM users WHERE username = ? AND password = ?")
        .bind(username, password)
        .first();
      if (!user) {
        return json({ error: "Invalid username or password" }, 401);
      }
      return json({ username: user.username }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.env.GAME_HISTORY
          .prepare(
            "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))"
          )
          .run();
        return this.handleSignin(request);
      }
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

// Reuses the site's own design tokens (--ink, --line, --overlay, --flag, --dim)
// so this never needs its own separate color palette.
const AUTH_CSS = `<style>
#cf-account-btn svg{width:18px;height:18px;display:block;}
#cf-account-label{
  display:none;
  align-items:center;
  font-family:'Karla',sans-serif;
  font-size:13px;
  font-weight:600;
  color:var(--ink);
  margin-right:6px;
  white-space:nowrap;
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
<span id="cf-account-label"></span>
<button id="cf-account-btn" class="header-btn" aria-label="Kuenta">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
</button>`;

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
      label=document.getElementById('cf-account-label'),
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

  function setSignedIn(username){
    openBtn.setAttribute('aria-label', username);
    label.textContent = 'Hi, ' + username;
    label.style.display = 'flex';
  }

  openBtn.addEventListener('click', function(){
    if(openBtn.dataset.user){ return; }
    openModal();
  });
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
        openBtn.dataset.user = d.username;
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
    openBtn.dataset.user = saved;
    setSignedIn(saved);
  }
})();</script>`;