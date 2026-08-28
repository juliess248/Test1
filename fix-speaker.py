from pathlib import Path
import re

file = Path("index.html")

if not file.exists():
    raise SystemExit("index.html not found in the current directory")

text = file.read_text(encoding="utf-8")

# Remove common floating positioning rules from the speaker button.
text = re.sub(
    r'(\.audio-button\s*\{[^}]*?)position\s*:\s*(absolute|fixed)\s*;',
    r'\1position: static;',
    text,
    flags=re.S
)

text = re.sub(
    r'(\.speaker(?:-button)?\s*\{[^}]*?)position\s*:\s*(absolute|fixed)\s*;',
    r'\1position: static;',
    text,
    flags=re.S
)

# Add responsive speaker/card layout styles before </style>.
css = """
/* Speaker positioning fix */
.history-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.history-date-group {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.audio-button,
.speaker-button {
  position: static !important;
  top: auto !important;
  right: auto !important;
  bottom: auto !important;
  left: auto !important;
  transform: none !important;
  margin: 0 !important;

  width: 44px;
  height: 44px;
  padding: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 44px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.audio-button svg,
.speaker-button svg {
  width: 21px;
  height: 21px;
  display: block;
}

.history-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
"""

if "</style>" in text and "/* Speaker positioning fix */" not in text:
    text = text.replace("</style>", css + "\n</style>", 1)

file.write_text(text, encoding="utf-8")

print("Speaker CSS fix applied to index.html")
print("Now place the speaker button inside .history-date-group next to the date if it is not already there.")
