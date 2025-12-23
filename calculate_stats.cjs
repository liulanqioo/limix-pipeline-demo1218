const fs = require('fs');
const path = require('path');

// Get file path from command line args or default to the V2 file (though we want V1)
// We will call this script with the path to the converted CSV
const filePath = process.argv[2];

if (!filePath) {
    console.error("Please provide the CSV file path as an argument.");
    process.exit(1);
}

try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n'); // Don't filter empty yet to keep index alignment if needed, but for stats it's fine.

    if (lines.length === 0) {
        console.log("File is empty");
        process.exit(0);
    }

    // Assume first line is header
    const headers = lines[0].trim().split(',');
    
    // Initialize stats
    const stats = {};
    headers.forEach(h => {
        // Remove quotes if present
        const key = h.replace(/^"|"$/g, ''); 
        stats[key] = {
            values: [],
            missingCount: 0,
            totalCount: 0
        };
    });

    // Process rows
    // Note: This is a simple CSV parser and might fail on commas inside quotes.
    // But for this dataset (power grid data), it's likely numbers and simple strings.
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple split - might need regex for quoted CSV fields if data is complex
        // Regex to split by comma but ignore commas inside quotes:
        const row = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(','); 
        // Fallback to simple split if match fails or just use simple split if we trust data
        // Let's use a slightly more robust split
        const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        if (columns.length !== headers.length) {
            // console.warn(`Line ${i + 1} has mismatch column count: ${columns.length} vs ${headers.length}`);
            // Continue anyway, maybe trailing commas
        }

        headers.forEach((h, index) => {
            const key = h.replace(/^"|"$/g, '');
            if (!stats[key]) return; // Should not happen

            let val = columns[index] ? columns[index].trim() : '';
            // Remove quotes
            val = val.replace(/^"|"$/g, '');

            stats[key].totalCount++;

            // Check missing: empty, "null", "NaN", or just whitespace
            if (val === '' || val.toLowerCase() === 'null' || val.toLowerCase() === 'nan') {
                stats[key].missingCount++;
            } else {
                stats[key].values.push(val);
            }
        });
    }

    // Calculate results
    const results = {};
    Object.keys(stats).forEach(key => {
        const s = stats[key];
        const uniqueValues = new Set(s.values);
        const missingRate = (s.missingCount / s.totalCount * 100).toFixed(1) + '%';
        
        results[key] = {
            unique: uniqueValues.size,
            missing: missingRate
        };
    });

    console.log(JSON.stringify(results, null, 2));

} catch (err) {
    console.error("Error reading or processing file:", err);
}
