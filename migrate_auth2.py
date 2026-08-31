import sys, re, base64

NEW_HTML = base64.b64decode("""ICAgICAgPGlucHV0CiAgICAgICAgY2xhc3M9Im5hbWUtaW5wdXQiCiAgICAgICAgaWQ9ImF1dGhVc2VybmFtZSIKICAgICAgICB0eXBlPSJ0ZXh0IgogICAgICAgIGF1dG9jb21wbGV0ZT0idXNlcm5hbWUiCiAgICAgICAgc3BlbGxjaGVjaz0iZmFsc2UiCiAgICAgICAgcGxhY2Vob2xkZXI9IkJvIG7Dsm1iZXIgZGkgdXp1YXJpbyI+CiAgICAgIDxkaXYKICAgICAgICBjbGFzcz0iYXV0aC1lbWFpbC1oaW50IgogICAgICAgIGlkPSJhdXRoRW1haWxIaW50IgogICAgICAgIHN0eWxlPSJkaXNwbGF5Om5vbmU7cGFkZGluZzoxMHB4IDEycHg7YmFja2dyb3VuZDp2YXIoLS1saW5lKTtib3JkZXItcmFkaXVzOjhweDtmb250LXNpemU6MTJweDtjb2xvcjp2YXIoLS1kaW0pO2xpbmUtaGVpZ2h0OjEuNDsiPgogICAgICAgIEVzYWtpIHBhcnNlIHVuIGVtYWlsIOKAlCBibyBrZSB1c2EgIjxzcGFuIGlkPSJhdXRoRW1haWxIaW50VmFsdWUiPjwvc3Bhbj4iIGtvbW8gYm8gZW1haWwgZGkgcmVrdXBlcmFzaG9uIGkgc2tvaGUgdW4gb3RybyBuw7JtYmVyIGRpIHV6dWFyaW8/CiAgICAgICAgPGJ1dHRvbgogICAgICAgICAgdHlwZT0iYnV0dG9uIgogICAgICAgICAgaWQ9ImF1dGhVc2VBc0VtYWlsQnRuIgogICAgICAgICAgc3R5bGU9ImRpc3BsYXk6YmxvY2s7bWFyZ2luLXRvcDo2cHg7YmFja2dyb3VuZDpub25lO2JvcmRlcjpub25lO2NvbG9yOnZhcigtLWZsYWcpO2ZvbnQtd2VpZ2h0OjcwMDtmb250LXNpemU6MTJweDtjdXJzb3I6cG9pbnRlcjtwYWRkaW5nOjA7dGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZTsiPgogICAgICAgICAgU8OtLCB1c2EgZGplCiAgICAgICAgPC9idXR0b24+CiAgICAgIDwvZGl2PgogICAgICA8aW5wdXQKICAgICAgICBjbGFzcz0ibmFtZS1pbnB1dCIKICAgICAgICBpZD0iYXV0aEVtYWlsIgogICAgICAgIHR5cGU9ImVtYWlsIgogICAgICAgIGF1dG9jb21wbGV0ZT0iZW1haWwiCiAgICAgICAgc3BlbGxjaGVjaz0iZmFsc2UiCiAgICAgICAgcGxhY2Vob2xkZXI9IkVtYWlsIChvcHNob25hbCwgcGEgcmVrdXBlcsOhIGJvIGt1ZW50YSkiCiAgICAgICAgc3R5bGU9ImRpc3BsYXk6bm9uZTsiPgogICAgICA8aW5wdXQKICAgICAgICBjbGFzcz0ibmFtZS1pbnB1dCIKICAgICAgICBpZD0iYXV0aFBhc3N3b3JkIgogICAgICAgIHR5cGU9InBhc3N3b3JkIgogICAgICAgIGF1dG9jb21wbGV0ZT0ibmV3LXBhc3N3b3JkIgogICAgICAgIHBsYWNlaG9sZGVyPSJLb250cmFzZcOxYSI+Cg==""").decode("utf-8")
NEW_RENDER_AUTH = base64.b64decode("""ZnVuY3Rpb24gcmVuZGVyQXV0aCgpewogIGNvbnN0IGNhcmQgPQogICAgJCgnYXV0aENhcmQnKTsKICBpZihhY2NvdW50KXsKICAgIGNhcmQuc3R5bGUuZGlzcGxheSA9ICdub25lJzsKICAgIHJldHVybjsKICB9CiAgY2FyZC5zdHlsZS5kaXNwbGF5ID0gJyc7CiAgY29uc3Qgc2lnbnVwID0KICAgIGF1dGhNb2RlID09PSAnc2lnbnVwJzsKICAkKCdhdXRoUGFzc3dvcmQnKS5zZXRBdHRyaWJ1dGUoCiAgICAnYXV0b2NvbXBsZXRlJywKICAgIHNpZ251cAogICAgICA/ICduZXctcGFzc3dvcmQnCiAgICAgIDogJ2N1cnJlbnQtcGFzc3dvcmQnCiAgKTsKICAkKCdhdXRoRW1haWwnKS5zdHlsZS5kaXNwbGF5ID0KICAgIHNpZ251cAogICAgICA/ICcnCiAgICAgIDogJ25vbmUnOwogICQoJ2F1dGhFbWFpbEhpbnQnKS5zdHlsZS5kaXNwbGF5ID0KICAgICdub25lJzsKICBpZighc2lnbnVwKXsKICAgICQoJ2F1dGhFbWFpbCcpLnZhbHVlID0gJyc7CiAgfQogICQoJ2F1dGhUaXRsZScpLnRleHRDb250ZW50ID0KICAgIHNpZ251cAogICAgICA/ICdLcmVhIGJvIGt1ZW50YScKICAgICAgOiAnRHJlbnRhIGJvIGt1ZW50YSc7CiAgJCgnYXV0aFN1Ym1pdCcpLnRleHRDb250ZW50ID0KICAgIHNpZ251cAogICAgICA/ICdLcmVhIGt1ZW50YScKICAgICAgOiAnRHJlbnRhJzsKICAkKCdhdXRoVG9nZ2xlJykudGV4dENvbnRlbnQgPQogICAgc2lnbnVwCiAgICAgID8gJ0JvIHRpbiBrdWVudGEga2FiYT8gRHJlbnRhJwogICAgICA6ICdObyB0aW4ga3VlbnRhIGFpbmRhPyBLcmVhIHVuJzsKfQo=""").decode("utf-8")
NEW_SUBMIT_AUTH = base64.b64decode("""YXN5bmMgZnVuY3Rpb24gc3VibWl0QXV0aCh1c2VybmFtZSxwYXNzd29yZCxlbWFpbCl7CiAgY29uc3QgZW5kcG9pbnQgPQogICAgYXV0aE1vZGUgPT09ICdzaWdudXAnCiAgICAgID8gJ3NpZ251cCcKICAgICAgOiAnc2lnbmluJzsKICBjb25zdCBwYXlsb2FkID0gewogICAgdXNlcm5hbWUsCiAgICBwYXNzd29yZAogIH07CiAgaWYoZW5kcG9pbnQgPT09ICdzaWdudXAnICYmIGVtYWlsKXsKICAgIHBheWxvYWQuZW1haWwgPSBlbWFpbDsKICB9CiAgY29uc3QgcmVzcG9uc2UgPQogICAgYXdhaXQgZmV0Y2goCiAgICAgIEFVVEhfRU5EUE9JTlQgKyBlbmRwb2ludCwKICAgICAgewogICAgICAgIG1ldGhvZDonUE9TVCcsCiAgICAgICAgaGVhZGVyczp7CiAgICAgICAgICAnY29udGVudC10eXBlJzoKICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nCiAgICAgICAgfSwKICAgICAgICBib2R5OkpTT04uc3RyaW5naWZ5KHBheWxvYWQpCiAgICAgIH0KICAgICk7CiAgY29uc3QgZGF0YSA9CiAgICBhd2FpdCByZXNwb25zZS5qc29uKCk7CiAgaWYoIXJlc3BvbnNlLm9rIHx8IGRhdGEuZXJyb3IpewogICAgdGhyb3cgbmV3IEVycm9yKAogICAgICBkYXRhLmVycm9yIHx8CiAgICAgICdBbGd1IGEgYmFpIHJvYmVzLiBQdXJiYSBhdHJvYmUuJwogICAgKTsKICB9CiAgcmV0dXJuIGRhdGE7Cn0KY29uc3QgRU1BSUxfUEFUVEVSTl9BVVRIID0KICAvXlteXHNAXStAW15cc0BdK1wuW15cc0BdKyQvOwppZigkKCdhdXRoVXNlcm5hbWUnKSl7CiAgJCgnYXV0aFVzZXJuYW1lJykuYWRkRXZlbnRMaXN0ZW5lcigKICAgICdibHVyJywKICAgICgpID0+IHsKICAgICAgaWYoYXV0aE1vZGUgIT09ICdzaWdudXAnKSByZXR1cm47CiAgICAgIGNvbnN0IHZhbHVlID0KICAgICAgICAkKCdhdXRoVXNlcm5hbWUnKS52YWx1ZS50cmltKCk7CiAgICAgIGlmKEVNQUlMX1BBVFRFUk5fQVVUSC50ZXN0KHZhbHVlKSl7CiAgICAgICAgJCgnYXV0aEVtYWlsSGludFZhbHVlJykudGV4dENvbnRlbnQgPQogICAgICAgICAgdmFsdWU7CiAgICAgICAgJCgnYXV0aEVtYWlsSGludCcpLnN0eWxlLmRpc3BsYXkgPQogICAgICAgICAgJ2Jsb2NrJzsKICAgICAgfWVsc2V7CiAgICAgICAgJCgnYXV0aEVtYWlsSGludCcpLnN0eWxlLmRpc3BsYXkgPQogICAgICAgICAgJ25vbmUnOwogICAgICB9CiAgICB9CiAgKTsKfQppZigkKCdhdXRoVXNlQXNFbWFpbEJ0bicpKXsKICAkKCdhdXRoVXNlQXNFbWFpbEJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoCiAgICAnY2xpY2snLAogICAgKCkgPT4gewogICAgICAkKCdhdXRoRW1haWwnKS52YWx1ZSA9CiAgICAgICAgJCgnYXV0aFVzZXJuYW1lJykudmFsdWUudHJpbSgpOwogICAgICAkKCdhdXRoVXNlcm5hbWUnKS52YWx1ZSA9ICcnOwogICAgICAkKCdhdXRoVXNlcm5hbWUnKS5mb2N1cygpOwogICAgICAkKCdhdXRoRW1haWxIaW50Jykuc3R5bGUuZGlzcGxheSA9CiAgICAgICAgJ25vbmUnOwogICAgfQogICk7Cn0K""").decode("utf-8")
NEW_SUBMIT_HANDLER = base64.b64decode("""ICAgIGNvbnN0IHVzZXJuYW1lID0KICAgICAgY2xlYW5OYW1lKAogICAgICAgICQoJ2F1dGhVc2VybmFtZScpLnZhbHVlCiAgICAgICk7CiAgICBjb25zdCBwYXNzd29yZCA9CiAgICAgICQoJ2F1dGhQYXNzd29yZCcpLnZhbHVlOwogICAgY29uc3QgZW1haWwgPQogICAgICAkKCdhdXRoRW1haWwnKSA/CiAgICAgICAgJCgnYXV0aEVtYWlsJykudmFsdWUudHJpbSgpIDoKICAgICAgICAnJzsKICAgIGlmKCF1c2VybmFtZSl7CiAgICAgICQoJ2F1dGhVc2VybmFtZScpLmZvY3VzKCk7CiAgICAgIHJldHVybjsKICAgIH0KICAgIGlmKCFwYXNzd29yZCl7CiAgICAgICQoJ2F1dGhQYXNzd29yZCcpLmZvY3VzKCk7CiAgICAgIHJldHVybjsKICAgIH0KICAgIHNldEF1dGhCdXN5KHRydWUpOwogICAgc2hvd0F1dGhNZXNzYWdlKCcnKTsKICAgIHRyeXsKICAgICAgY29uc3QgZGF0YSA9CiAgICAgICAgYXdhaXQgc3VibWl0QXV0aCgKICAgICAgICAgIHVzZXJuYW1lLAogICAgICAgICAgcGFzc3dvcmQsCiAgICAgICAgICBlbWFpbAogICAgICAgICk7Cg==""").decode("utf-8")

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

def replace_function_by_marker(text, marker, new_code, label):
    idx = text.find(marker)
    if idx == -1:
        print(f"  SKIPPED: {label} - marker not found")
        return text, False
    brace_start = text.index("{", idx)
    end = find_matching_brace(text, brace_start)
    return text[:idx] + new_code.rstrip("\n") + text[end:], True

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

OLD_HTML_TEMPLATE = '''<input
        class="name-input"
        id="authUsername"
        type="text"
        autocomplete="username"
        spellcheck="false"
        placeholder="Bo nòmber di uzuario">
      <input
        class="name-input"
        id="authPassword"
        type="password"
        autocomplete="new-password"
        placeholder="Kontraseña">'''

OLD_SUBMIT_HANDLER_TEMPLATE = '''const username =
      cleanName(
        $('authUsername').value
      );
    const password =
      $('authPassword').value;
    if(!username){
      $('authUsername').focus();
      return;
    }
    if(!password){
      $('authPassword').focus();
      return;
    }
    setAuthBusy(true);
    showAuthMessage('');
    try{
      const data =
        await submitAuth(
          username,
          password
        );'''

def main():
    path = sys.argv[1] if len(sys.argv) > 1 else "public/index.html"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    original = text
    changed = 0

    text, ok = replace_flexible(text, OLD_HTML_TEMPLATE, NEW_HTML, "auth form HTML")
    changed += ok

    text, ok = replace_function_by_marker(text, "function renderAuth(){", NEW_RENDER_AUTH, "renderAuth")
    changed += ok

    text, ok = replace_function_by_marker(text, "async function submitAuth(username,password){", NEW_SUBMIT_AUTH, "submitAuth")
    changed += ok

    text, ok = replace_flexible(text, OLD_SUBMIT_HANDLER_TEMPLATE, NEW_SUBMIT_HANDLER, "submit handler")
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
