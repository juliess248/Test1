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
        .on("body", {
          element(element) {
            element.prepend(AUTH_HTML, { html: true });
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

const AUTH_HTML = `<div id="cf-auth-bar" style="position:fixed;top:0;right:0;z-index:99999;display:flex;gap:8px;padding:12px 16px;font-family:system-ui,-apple-system,sans-serif;font-size:14px;"><button id="cf-signin-btn" style="padding:8px 18px;border:1px solid rgba(255,255,255,0.3);border-radius:6px;background:rgba(0,0,0,0.5);color:#fff;cursor:pointer;backdrop-filter:blur(8px);transition:background 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.7)'" onmouseout="this.style.background='rgba(0,0,0,0.5)'">Sign In</button><button id="cf-signup-btn" style="padding:8px 18px;border:none;border-radius:6px;background:#fff;color:#333;cursor:pointer;font-weight:600;transition:opacity 0.2s;" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">Sign Up</button></div><div id="cf-auth-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:100000;align-items:center;justify-content:center;"><div style="position:relative;background:#fff;border-radius:12px;padding:32px;max-width:380px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);"><h2 id="cf-modal-title" style="margin:0 0 20px;font-size:22px;color:#333;font-family:system-ui,-apple-system,sans-serif;">Sign In</h2><form id="cf-auth-form" style="display:flex;flex-direction:column;gap:14px;"><input id="cf-auth-username" type="text" placeholder="Username" required style="padding:10px 14px;border:1px solid #ddd;border-radius:6px;font-size:15px;font-family:inherit;" /><input id="cf-auth-password" type="password" placeholder="Password" required style="padding:10px 14px;border:1px solid #ddd;border-radius:6px;font-size:15px;font-family:inherit;" /><div id="cf-auth-error" style="color:#e74c3c;font-size:13px;display:none;"></div><button type="submit" style="padding:11px;border:none;border-radius:6px;background:#333;color:#fff;font-size:15px;cursor:pointer;font-weight:600;font-family:inherit;">Continue</button></form><p id="cf-auth-toggle" style="text-align:center;margin:16px 0 0;font-size:13px;color:#666;font-family:system-ui,-apple-system,sans-serif;cursor:pointer;">Don't have an account? Sign up</p><button id="cf-auth-close" style="position:absolute;top:8px;right:12px;background:none;border:none;font-size:24px;cursor:pointer;color:#999;line-height:1;">&times;</button></div></div><script>(function(){var modal=document.getElementById('cf-auth-modal'),title=document.getElementById('cf-modal-title'),form=document.getElementById('cf-auth-form'),toggle=document.getElementById('cf-auth-toggle'),errorEl=document.getElementById('cf-auth-error'),mode='signin';function openModal(m){mode=m;title.textContent=m==='signin'?'Sign In':'Sign Up';toggle.textContent=m==='signin'?"Don't have an account? Sign up":"Already have an account? Sign in";errorEl.style.display='none';modal.style.display='flex';}document.getElementById('cf-signin-btn').addEventListener('click',function(){openModal('signin');});document.getElementById('cf-signup-btn').addEventListener('click',function(){openModal('signup');});document.getElementById('cf-auth-close').addEventListener('click',function(){modal.style.display='none';});modal.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});toggle.addEventListener('click',function(){openModal(mode==='signin'?'signup':'signin');});form.addEventListener('submit',function(e){e.preventDefault();var u=document.getElementById('cf-auth-username').value,p=document.getElementById('cf-auth-password').value;errorEl.style.display='none';fetch('/api/auth/'+mode,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})}).then(function(r){return r.json();}).then(function(d){if(d.error){errorEl.textContent=d.error;errorEl.style.display='block';}else{localStorage.setItem('cf_user',d.username);modal.style.display='none';var btn=document.getElementById('cf-signin-btn'),upBtn=document.getElementById('cf-signup-btn');btn.textContent='Hi, '+d.username;btn.style.cursor='default';upBtn.style.display='none';}}).catch(function(){errorEl.textContent='Network error';errorEl.style.display='block';});});var saved=localStorage.getItem('cf_user');if(saved){var b=document.getElementById('cf-signin-btn'),ub=document.getElementById('cf-signup-btn');b.textContent='Hi, '+saved;b.style.cursor='default';ub.style.display='none';}})();</script>`;