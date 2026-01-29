import os

file_path = "/Users/dai/Documents/trae_projects/yanshi0125/src/LimiPreview.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip().startswith("const MOCK_AIR_QUALITY_TRENDS =") and "2024-03-10" in line:
        # This is the old data, skip it
        continue
    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Successfully removed duplicate declaration")
