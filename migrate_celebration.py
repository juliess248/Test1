import sys, re, base64

NEW_SUCCESS_HANDLER = base64.b64decode("""YXdhaXQgc3VibWl0QXV0aCgKICAgICAgICAgIHVzZXJuYW1lLAogICAgICAgICAgcGFzc3dvcmQsCiAgICAgICAgICBlbWFpbAogICAgICAgICk7CgogICAgICBjb25zdCB3YXNTaWdudXAgPQogICAgICAgIGF1dGhNb2RlID09PSAnc2lnbnVwJzsKCiAgICAgIGFjY291bnQgPSB7CiAgICAgICAgaWQ6ZGF0YS5pZCwKICAgICAgICB1c2VybmFtZTpkYXRhLnVzZXJuYW1lCiAgICAgIH07CiAgICAgIHNhdmVBY2NvdW50TG9jYWwoKTsKICAgICAgJCgnYXV0aFBhc3N3b3JkJykudmFsdWUgPSAnJzsKICAgICAgZWRpdGluZ05hbWUgPSBmYWxzZTsKCiAgICAgIGlmKHdhc1NpZ251cCl7CiAgICAgICAgaWYod2luZG93LlNPVU5EICYmIFNPVU5ELnNpZ251cFN1Y2Nlc3MpewogICAgICAgICAgU09VTkQuc2lnbnVwU3VjY2VzcygpOwogICAgICAgIH0KICAgICAgICBjb25zdCBtc2dCb3ggPSAkKCdhdXRoTXNnJyk7CiAgICAgICAgc2hvd0F1dGhNZXNzYWdlKCdLdWVudGEga3Jlw6EhIPCfjoknLCdvaycpOwogICAgICAgIGlmKG1zZ0JveCl7CiAgICAgICAgICBtc2dCb3guY2xhc3NMaXN0LmFkZCgnY2VsZWJyYXRlJyk7CiAgICAgICAgfQogICAgICAgIHNldFRpbWVvdXQoKCk9PnsKICAgICAgICAgIHJlbmRlck5hbWUoKTsKICAgICAgICAgIHJlbmRlckF1dGgoKTsKICAgICAgICAgIHN5bmNTY29yZSgpOwogICAgICAgICAgbG9hZFByb2dyZXNzKCk7CiAgICAgICAgICBsb2FkQm9hcmQoKTsKICAgICAgICAgIHNldEF1dGhCdXN5KGZhbHNlKTsKICAgICAgICB9LCAxMTAwKTsKICAgICAgfWVsc2V7CiAgICAgICAgcmVuZGVyTmFtZSgpOwogICAgICAgIHJlbmRlckF1dGgoKTsKICAgICAgICBzeW5jU2NvcmUoKTsKICAgICAgICBsb2FkUHJvZ3Jlc3MoKTsKICAgICAgICBsb2FkQm9hcmQoKTsKICAgICAgICBzZXRBdXRoQnVzeShmYWxzZSk7CiAgICAgIH0KICAgIH1jYXRjaChlcnJvcil7CiAgICAgIHNob3dBdXRoTWVzc2FnZSgKICAgICAgICBlcnJvci5tZXNzYWdlLAogICAgICAgICdlcnInCiAgICAgICk7CiAgICAgIHNldEF1dGhCdXN5KGZhbHNlKTsKICAgIH0KICB9Owo=""").decode("utf-8")

NEW_SOUND_FN = '''function signupSuccess(){
    playWhenReady(c=>{
      const t=c.currentTime+0.002;
      tone(c,523.25,t,0.10,'sine',0.035);
      tone(c,659.25,t+0.06,0.10,'sine',0.035);
      tone(c,783.99,t+0.12,0.16,'sine',0.04);
    });
  }'''

OLD_RETURN_TEMPLATE = '''hunga,
    word,
    pangram,
    invalid,
    complete,
    unlock,'''

NEW_RETURN = '''hunga,
    word,
    pangram,
    invalid,
    complete,
    signupSuccess,
    unlock,'''

OLD_CSS_TEMPLATE = '''.auth-msg.ok{
  background:rgba(249,227,0,.12);
  color:var(--flag-ink);
}'''

NEW_CSS = '''.auth-msg.ok{
  background:rgba(249,227,0,.12);
  color:var(--flag-ink);
}
.auth-msg.celebrate{
  animation:authCelebratePop .5s ease;
}
@keyframes authCelebratePop{
  0%{ transform:scale(.92); opacity:0; }
  60%{ transform:scale(1.03); opacity:1; }
  100%{ transform:scale(1); opacity:1; }
}'''

OLD_HANDLER_TEMPLATE = '''await submitAuth(
          username,
          password,
          email
        );
      account = {
        id:data.id,
        username:data.username
      };
      saveAccountLocal();
      $('authPassword').value = '';
      editingName = false;
      renderName();
      renderAuth();
      syncScore();
      loadProgress();
      loadBoard();
    }catch(error){
      showAuthMessage(
        error.message,
        'err'
      );
    }finally{
      setAuthBusy(false);
    }
  };'''

def find_matching_brace(text, brace_start):
    depth = 0
    i = brace_start
    in_string = None
    escape = False
    while i < len(text):
        ch = text[i]
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == in_string:
                in_string = None
        else:
            if ch in ('"', "'", "`"):
                in_string = ch
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    return i + 1
        i += 1
    raise ValueError("Unbalanced braces")

def append_after_function(text, marker, addition, label):
    idx = text.find(marker)
    if idx == -1:
        print(f"  SKIPPED: {label} - marker not found")
        return text, False
    brace_start = text.index("{", idx)
    end = find_matching_brace(text, brace_start)
    original_block = text[idx:end]
    new_block = original_block + "\n\n" + addition.rstrip("\n")
    return text[:idx] + new_block + text[end:], True

def build_flexible_pattern(template):
    tokens = re.split(r'(\s+)', template)
    parts = []
    for tok in tokens:
        if tok == "":
            continue
        if tok.strip() == "":
            parts.append(r'\s+')
        else:
            parts.append(re.escape(tok))
    return "".join(parts)

def replace_flexible(text, template, new_code, label):
    pattern = build_flexible_pattern(template)
    matches = list(re.finditer(pattern, text))
    if len(matches) != 1:
        print(f"  SKIPPED: {label} - found {len(matches)} match(es), expected 1")
        return text, False
    m = matches[0]
    return text[:m.start()] + new_code.rstrip("\n") + text[m.end():], True

def main():
    path = sys.argv[1] if len(sys.argv) > 1 else "public/index.html"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    original = text
    changed = 0

    text, ok = append_after_function(text, "function hunga(){", NEW_SOUND_FN, "signupSuccess sound function")
    changed += ok

    text, ok = replace_flexible(text, OLD_RETURN_TEMPLATE, NEW_RETURN, "SOUND return object")
    changed += ok

    text, ok = replace_flexible(text, OLD_CSS_TEMPLATE, NEW_CSS, "celebration CSS")
    changed += ok

    text, ok = replace_flexible(text, OLD_HANDLER_TEMPLATE, NEW_SUCCESS_HANDLER, "submit handler celebration")
    changed += ok

    if changed == 0:
        print("Nothing changed - no markers matched. File left untouched.")
        sys.exit(1)

    backup_path = path + ".bak"
    with open(backup_path, "w", encoding="utf-8") as f:
        f.write(original)
    print(f"Backup saved to {backup_path}")

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Applied {changed}/4 replacements to {path}")

if __name__ == "__main__":
    main()
