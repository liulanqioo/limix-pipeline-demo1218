const fs = require('fs');

const MOCK_INFLUENCE_FACTORS_AIR = [
  "PT08.S3(NOx)", "NO2(GT)", "PT08.S4(NO2)", 
  "CO(GT)", "PT08.S1(CO)", "NMHC(GT)", "C6H6(GT)", 
  "PT08.S2(NMHC)", "PT08.S5(O3)", "T", "RH", "AH"
];

const MOCK_HEATMAP_DATES_AIR = Array.from({ length: 168 }, (_, i) => {
    const d = new Date(2024, 2, 25, i); // Start from 2024-03-25 00:00
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:00`;
});

const MOCK_HEATMAP_MATRIX_AIR = MOCK_HEATMAP_DATES_AIR.map((date, rIndex) => {
  const d = new Date(date);
  const hour = d.getHours();
  
  const morningPeak = Math.exp(-Math.pow(hour - 8, 2) / 6); 
  const eveningPeak = Math.exp(-Math.pow(hour - 18, 2) / 8); 
  const trafficPattern = (morningPeak * 1.2 + eveningPeak * 1.0); 

  const solarPattern = Math.exp(-Math.pow(hour - 14, 2) / 10);
  
  // Use a fixed seed-like behavior for consistency if possible, but here we just replicate logic
  // Math.random() will differ, but the pattern holds.
  const dayTrend = Math.sin(rIndex / 24) * 0.3; // Removed random component for cleaner export, or keep it if needed

  return MOCK_INFLUENCE_FACTORS_AIR.map((factor, cIndex) => {
    const noise = 0; // Removed noise for cleaner "underlying trend" data, or keep small noise
    let value = 0;

    if (["PT08.S3(NOx)", "NO2(GT)", "PT08.S4(NO2)"].includes(factor)) {
        value = trafficPattern * 1.5 + dayTrend + noise;
        if (factor === "PT08.S3(NOx)") value *= 1.1;
    }
    else if (["CO(GT)", "PT08.S1(CO)", "NMHC(GT)", "C6H6(GT)", "PT08.S2(NMHC)"].includes(factor)) {
        value = trafficPattern * 1.2 + dayTrend + noise;
    }
    else if (factor === "PT08.S5(O3)") {
        const afternoonDip = solarPattern * 1.0; 
        value = (trafficPattern * 0.8) - afternoonDip + dayTrend + noise;
    }
    else if (["T", "AH"].includes(factor)) {
        const tempPattern = Math.sin(((hour - 4) / 24) * 2 * Math.PI);
        value = -1 * tempPattern * 0.8 + dayTrend + noise;
    }
    else if (factor === "RH") {
        value = 0;
    }

    return Math.max(-2, Math.min(2, value)).toFixed(4);
  });
});

// Convert to CSV
const header = "Timestamp," + MOCK_INFLUENCE_FACTORS_AIR.join(",");
const rows = MOCK_HEATMAP_MATRIX_AIR.map((row, i) => {
    return `${MOCK_HEATMAP_DATES_AIR[i]},${row.join(",")}`;
});
const csvContent = [header, ...rows].join("\n");

fs.writeFileSync('docs/air_quality_heatmap_data.csv', csvContent);
console.log('CSV file created at docs/air_quality_heatmap_data.csv');
