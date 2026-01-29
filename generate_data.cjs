
const fs = require('fs');
const path = require('path');

function parseCSV(filePath, limit = 8000) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split(/\r?\n/).filter(l => l.trim());
        if (lines.length === 0) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = [];
        // 从第1行开始读，读到 limit+1 行（即 limit 条数据）
        for (let i = 1; i < Math.min(lines.length, limit + 1); i++) {
            // 简单的 CSV 解析，不处理引号内的逗号，因为预览显示数据比较简单
            const values = lines[i].split(','); 
            
            // 如果列数不匹配，可能是最后一行空行或者格式错误，跳过
            // 但考虑到有些CSV末尾可能有空字段，我们尽量宽容
            if (values.length < headers.length) continue;

            const row = {};
            headers.forEach((h, index) => {
                let val = values[index];
                if (val === undefined) val = "";
                val = val.trim();
                
                // 尝试转数字，但保留日期和空字符串
                if (val === "" || val.toLowerCase() === "nan") {
                    row[h] = val; // 保留空字符串或 "nan"
                } else {
                    const num = Number(val);
                    if (!isNaN(num)) {
                         row[h] = num;
                    } else {
                        row[h] = val;
                    }
                }
            });
            data.push(row);
        }
        return data;
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
        return [];
    }
}

const machineData = parseCSV('/Users/dai/Documents/trae_projects/yanshi0125/源文件/机器预测性维护分类训练集.csv');
const priceData = parseCSV('/Users/dai/Documents/trae_projects/yanshi0125/源文件/test_+5_V2-清洗后.csv');
const clfData = parseCSV('/Users/dai/Documents/trae_projects/yanshi0125/源文件/test_分类_V1.csv');

// 针对 Machine 数据，确保 label 字段存在 (Target -> label)
machineData.forEach(row => {
    if (row.Target !== undefined && row.label === undefined) {
        row.label = row.Target;
    }
});

const fileContent = `
// 自动生成的真实数据文件
// 来源：/Users/dai/Documents/trae_projects/yanshi0125/源文件/

export const REAL_MACHINE_DATA = ${JSON.stringify(machineData, null, 2)};
export const REAL_PRICE_DATA = ${JSON.stringify(priceData, null, 2)};
export const REAL_CLF_DATA = ${JSON.stringify(clfData, null, 2)};
`;

fs.writeFileSync('/Users/dai/Documents/trae_projects/yanshi0125/src/data/real_data.js', fileContent);
console.log(`Generated real_data.js with:
Machine: ${machineData.length} rows
Price: ${priceData.length} rows
Clf: ${clfData.length} rows`);
