const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 读取空气质量预测训练集
const filePath = path.join(__dirname, '源文件/空气质量预测训练集_副本44.xlsx');

try {
    console.log('正在读取文件:', filePath);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 转换为JSON，设置选项以正确处理日期
    const data = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,  // 不使用原始值，会自动格式化日期
        dateNF: 'yyyy-mm-dd hh:mm:ss'  // 日期格式
    });
    
    console.log(`数据集总行数: ${data.length}`);
    console.log(`数据集总列数: ${Object.keys(data[0]).length}`);
    
    // 生成JavaScript文件
    const output = `// 空气质量预测完整训练集数据 (${data.length}行)
// 自动生成于 ${new Date().toISOString()}

export const REAL_AIR_DATA = ${JSON.stringify(data, null, 2)};
`;
    
    const outputPath = path.join(__dirname, 'src/data/real_air_data.js');
    fs.writeFileSync(outputPath, output);
    
    console.log('\n✅ 成功生成文件:', outputPath);
    console.log(`✅ 包含 ${data.length} 行完整数据`);
    
} catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
}
