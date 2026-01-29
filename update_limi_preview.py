import os
import re

file_path = "/Users/dai/Documents/trae_projects/yanshi0125/src/LimiPreview.jsx"
data_path = "/Users/dai/Documents/trae_projects/yanshi0125/temp_air_data.json"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

with open(data_path, 'r', encoding='utf-8') as f:
    new_data = f.read()

# Define new variable name and content
new_var_name = "MOCK_AIR_QUALITY_TRENDS"
new_block = f"const {new_var_name} = {new_data};\n"

# Find the start of MOCK_CHART_DATA_AIR
start_marker = "const MOCK_CHART_DATA_AIR = ["
start_idx = content.find(start_marker)

if start_idx == -1:
    print("Error: MOCK_CHART_DATA_AIR not found")
    exit(1)

# Find the end of the block
# We look for "];" after the start
end_idx = content.find("];", start_idx)
if end_idx == -1:
    print("Error: End of MOCK_CHART_DATA_AIR block not found")
    exit(1)

# Include the semicolon
end_idx += 2

# Replace the definition
# Check if there's a newline after ];
if end_idx < len(content) and content[end_idx] == '\n':
    end_idx += 1

new_content = content[:start_idx] + new_block + content[end_idx:]

# Replace usages
new_content = new_content.replace("MOCK_CHART_DATA_AIR", new_var_name)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully updated LimiPreview.jsx")
