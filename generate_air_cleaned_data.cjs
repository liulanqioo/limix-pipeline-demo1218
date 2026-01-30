const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 读取清洗后的空气质量训练集
const cleanedFilePath = path.join(__dirname, '源文件/空气质量预测训练集清洗1.xlsx');
const testFilePath = path.join(__dirname, '源文件/空气质量预测测试集.xlsx');

try {
    console.log('正在读取清洗后的训练集文件:', cleanedFilePath);
    const cleanedWorkbook = XLSX.readFile(cleanedFilePath);
    const cleanedSheet = cleanedWorkbook.Sheets[cleanedWorkbook.SheetNames[0]];
    
    // 转换为JSON，设置选项以正确处理日期
    const cleanedData = XLSX.utils.sheet_to_json(cleanedSheet, {
        raw: false,  // 不使用原始值，会自动格式化日期
        dateNF: 'yyyy-mm-dd hh:mm:ss'  // 日期格式
    });
    
    console.log(`清洗后训练集总行数: ${cleanedData.length}`);
    console.log(`清洗后训练集总列数: ${Object.keys(cleanedData[0]).length}`);
    
    // 只取前10行
    const preview10 = cleanedData.slice(0, 10);
    
    // 生成JavaScript格式
    const jsContent = `// 空气质量预测清洗后训练集预览数据 (前10行)
// 自动生成于 ${new Date().toISOString()}

export const AIR_CLEANED_PREVIEW = ${JSON.stringify(preview10, null, 2)};
`;
    
    const outputPath = path.join(__dirname, 'src/data/air_cleaned_preview.js');
    fs.writeFileSync(outputPath, jsContent, 'utf8');
    console.log('\n✅ 成功生成清洗后训练集预览文件:', outputPath);
    console.log('✅ 包含前10行预览数据');
    
    // 读取测试集
    console.log('\n正在读取测试集文件:', testFilePath);
    const testWorkbook = XLSX.readFile(testFilePath);
    const testSheet = testWorkbook.Sheets[testWorkbook.SheetNames[0]];
    
    const testData = XLSX.utils.sheet_to_json(testSheet, {
        raw: false,
        dateNF: 'yyyy-mm-dd hh:mm:ss'
    });
    
    console.log(`测试集总行数: ${testData.length}`);
    console.log(`测试集总列数: ${Object.keys(testData[0]).length}`);
    
    // 只取前10行
    const testPreview10 = testData.slice(0, 10);
    
    // 生成JavaScript格式
    const testJsContent = `// 空气质量预测测试集预览数据 (前10行)
// 自动生成于 ${new Date().toISOString()}

export const AIR_TEST_PREVIEW = ${JSON.stringify(testPreview10, null, 2)};
`;
    
    const testOutputPath = path.join(__dirname, 'src/data/air_test_preview.js');
    fs.writeFileSync(testOutputPath, testJsContent, 'utf8');
    console.log('\n✅ 成功生成测试集预览文件:', testOutputPath);
    console.log('✅ 包含前10行预览数据');
    
} catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
}
