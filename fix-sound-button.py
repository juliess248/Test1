from pathlib import Path
import re

path = Path("public/index.html")

if not path.exists():
    raise SystemExit("ERROR: public/index.html not found")

text = path.read_text(encoding="utf-8")

# ------------------------------------------------------------
# Remove ANY existing sound-toggle button from wherever it is.
# ------------------------------------------------------------
text, count = re.subn(
    r'<button\b[^>]*\bid=["\']sound-toggle["\'][^>]*>.*?</button>',
    '',
    text,
    flags=re.S | re.I
)

print("Removed existing sound buttons:", count)

# ------------------------------------------------------------
# Create a clean header button.
# Existing JavaScript can continue changing its text to
# speaker/mute icons.
# ------------------------------------------------------------
button = '''
    <button
      class="header-btn"
      id="sound-toggle"
      type="button"
      aria-label="Zonido">
      🔊
    </button>
'''

# Find the header-actions container.
match = re.search(
    r'(<div class="header-actions">)(.*?)(</div>\s*</header>)',
    text,
    flags=re.S
)

if not match:
    raise SystemExit("ERROR: .header-actions could not be found")

replacement = (
    match.group(1)
    + match.group(2)
    + "\n"
    + button
    + "\n  "
    + match.group(3)
)

text = (
    text[:match.start()]
    + replacement
    + text[match.end():]
)

path.write_text(text, encoding="utf-8")

print("SUCCESS")
print("Sound button moved into the top header.")
