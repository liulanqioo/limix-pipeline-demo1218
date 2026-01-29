import subprocess
import json
import re

def get_output(script_name):
    result = subprocess.run(['python3', script_name], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running {script_name}: {result.stderr}")
        return None
    return result.stdout.strip()

print("Extracting data...")
nox_json = get_output('get_nox_data.py')
trends_json = get_output('get_air_quality_trends.py')

if not nox_json or not trends_json:
    print("Failed to extract data.")
    exit(1)

# Read file
file_path = 'src/LimiPreview.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# Update MOCK_NOX_PREDICTION
print("Updating MOCK_NOX_PREDICTION...")
content = re.sub(
    r'const MOCK_NOX_PREDICTION = \[.*?\];',
    f'const MOCK_NOX_PREDICTION = {nox_json};',
    content,
    flags=re.DOTALL
)

# Update MOCK_AIR_QUALITY_TRENDS
print("Updating MOCK_AIR_QUALITY_TRENDS...")
content = re.sub(
    r'const MOCK_AIR_QUALITY_TRENDS = \[.*?\];',
    f'const MOCK_AIR_QUALITY_TRENDS = {trends_json};',
    content,
    flags=re.DOTALL
)

# Write back
with open(file_path, 'w') as f:
    f.write(content)

print(f"Successfully updated {file_path}")
