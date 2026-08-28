python3 << 'PYEOF'
import re

FILE = "./deploy/index.html"  # <-- change this to your actual landing page file path

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = '''      <div class="board-name">

        ${escapeHtml(entry.name)}

        ${
          isMe
            ? '<span class="board-you">bo</span>'
            : ''
        }

        <div class="board-meta">
          ${meta}
        </div>

      </div>

      <div class="board-score">
        ${entry.score}
      </div>

    </div>'''

new = '''      <div class="board-name">

        ${
          isMe
            ? '<span class="board-you">bo</span>'
            : ''
        }

        <div class="board-meta">
          ${meta}
        </div>

      </div>

    </div>'''

if old not in content:
    print("❌ Could not find the exact block — no changes made. The whitespace may differ slightly from what's actually in your file.")
else:
    content = content.replace(old, new)
    with open(FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print("✅ Updated successfully!")
