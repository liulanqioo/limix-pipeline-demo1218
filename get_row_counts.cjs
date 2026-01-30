const XLSX = require('xlsx');
const path = require('path');

// 读取训练集
const trainFile = path.join(__dirname, '源文件/空气质量预测训练集_副本44.xlsx');
const testFile = path.join(__dirname, '源文件/空气质量预测测试集.xlsx');

try {
    console.log('读取训练集文件:', trainFile);
    const trainWorkbook = XLSX.readFile(trainFile);
    const trainSheet = trainWorkbook.Sheets[trainWorkbook.SheetNames[0]];
    const trainData = XLSX.utils.sheet_to_json(trainSheet);
    
    console.log('读取测试集文件:', testFile);
    const testWorkbook = XLSX.readFile(testFile);
    const testSheet = testWorkbook.Sheets[testWorkbook.SheetNames[0]];
    const testData = XLSX.utils.sheet_to_json(testSheet);
    
    console.log('\n============ 行数统计 ============');
    console.log(`训练集行数: ${trainData.length}`);
    console.log(`测试集行数: ${testData.length}`);
    console.log('==================================\n');
    
} catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
}
