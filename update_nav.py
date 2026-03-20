import os
import re

folder = r"c:\Users\caoxp2024\.windsurf\caoxp.github.io-1"

pattern = re.compile(r'(<tr><td class="menu"><a href="people\.html">People</a></td></tr>)\s*</table>')

replacement = r'\1\n                    <tr><td class="menu"><a href="travel.html">Footprints</a></td></tr>\n                </table>'

for file in os.listdir(folder):
    if file.endswith(".html"):
        filepath = os.path.join(folder, file)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        if pattern.search(content):
            # Don't duplicate if already there
            if "travel.html" not in content:
                content = pattern.sub(replacement, content)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                print("Updated", file)
