const XLSX = require('xlsx');
const path = require('path');

// 读取空气质量预测训练集
const filePath = path.join(__dirname, '源文件/空气质量预测训练集_副本44.xlsx');

try {
    console.log('正在读取文件:', filePath);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 转换为JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`\n数据集总行数: ${data.length}`);
    console.log('\n' + '='.repeat(100));
    console.log('列名'.padEnd(25) + '唯一值'.padEnd(12) + '缺失率'.padEnd(12) + '均值'.padEnd(20) + '方差'.padEnd(20));
    console.log('='.repeat(100));
    
    const columns = Object.keys(data[0]);
    
    columns.forEach(col => {
        const values = [];
        let missingCount = 0;
        
        data.forEach(row => {
            const val = row[col];
            if (val === undefined || val === null || val === '' || 
                (typeof val === 'string' && val.toLowerCase() === 'nan') ||
                (typeof val === 'number' && isNaN(val))) {
                missingCount++;
            } else {
                const numVal = parseFloat(val);
                if (!isNaN(numVal)) {
                    values.push(numVal);
                }
            }
        });
        
        const uniqueCount = new Set(data.map(r => r[col]).filter(v => v !== undefined && v !== null && v !== '')).size;
        const missingRate = ((missingCount / data.length) * 100);
        const missingStr = missingRate === 0 ? '0.0%' : `${missingRate.toFixed(1)}%`;
        
        let meanStr = '-';
        let varianceStr = '-';
        
        if (values.length > 0) {
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
            
            // 使用toPrecision(4)来匹配前端显示
            meanStr = mean.toPrecision(4);
            varianceStr = variance.toPrecision(4);
        }
        
        console.log(
            col.padEnd(25) + 
            uniqueCount.toString().padEnd(12) + 
            missingStr.padEnd(12) + 
            meanStr.padEnd(20) + 
            varianceStr.padEnd(20)
        );
    });
    
    console.log('='.repeat(100));
    
} catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
}
