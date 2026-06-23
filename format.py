import re

with open('src/content/docs/codice_etico.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

out_lines = []
in_indice = True

for line in lines:
    line = line.strip()
    if not line:
        continue
        
    if in_indice:
        if line == "CODICE ETICO ABBO APS":
            in_indice = False
        else:
            continue
            
    if not in_indice:
        if line == "CODICE ETICO ABBO APS":
            out_lines.append("# CODICE ETICO ABBO APS\n")
        elif line.startswith("TITOLO"):
            out_lines.append(f"## {line}\n")
        elif line.startswith("Art."):
            out_lines.append(f"### {line}\n")
        else:
            out_lines.append(f"{line}\n\n")

with open('src/content/docs/codice_etico.md', 'w', encoding='utf-8') as f:
    f.writelines(out_lines)
