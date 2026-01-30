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
    
    console.log(`数据集总行数: ${data.length}`);
    console.log(`数据集总列数: ${Object.keys(data[0]).length}`);
    console.log('\n' + '='.repeat(80));
    console.log('列名'.padEnd(40) + '唯一值'.padEnd(15) + '缺失率'.padEnd(15));
    console.log('='.repeat(80));
    
    const results = {};
    const columns = Object.keys(data[0]);
    
    columns.forEach(col => {
        const values = new Set();
        let missingCount = 0;
        
        data.forEach(row => {
            const val = row[col];
            if (val === undefined || val === null || val === '' || 
                (typeof val === 'string' && val.toLowerCase() === 'nan') ||
                (typeof val === 'number' && isNaN(val))) {
                missingCount++;
            } else {
                values.add(val);
            }
        });
        
        const uniqueCount = values.size;
        const missingRate = ((missingCount / data.length) * 100);
        const missingStr = missingRate === 0 ? '0.0%' : `${missingRate.toFixed(1)}%`;
        
        results[col] = {
            unique: uniqueCount,
            missing: missingStr
        };
        
        console.log(col.padEnd(40) + uniqueCount.toString().padEnd(15) + missingStr.padEnd(15));
    });
    
    console.log('='.repeat(80));
    console.log('\n生成的JavaScript代码:\n');
    console.log('// 空气质量预测数据列统计（基于完整训练集）');
    
    columns.forEach(col => {
        const stats = results[col];
        console.log(`  "${col}": { unique: ${stats.unique}, missing: "${stats.missing}" },`);
    });
    
} catch (error) {
    console.error('错误:', error.message);
    console.error('\n提示: 请确保已安装 xlsx 依赖');
    console.error('运行: npm install xlsx');
    process.exit(1);
}
