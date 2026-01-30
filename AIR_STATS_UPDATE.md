# 空气质量预测场景唯一值统计更新

## 更新时间
2026-01-30

## 更新内容

### 问题描述
空气质量监测场景中，红框里的唯一值指标（以及缺失率）原本基于预览的10行数据计算，导致统计不准确。另外，时间列不应该显示唯一值。

### 解决方案
1. 使用Node.js脚本读取完整的Excel训练集文件（`源文件/空气质量预测训练集.xlsx`，共324行），计算每个字段的真实唯一值数量和缺失率
2. 修改前端代码，让时间列（Time）不显示唯一值统计

### 技术实现

1. **创建统计脚本**: `calculate_air_stats.cjs`
   - 使用 `xlsx` 库读取Excel文件
   - 计算每列的唯一值数量
   - 计算每列的缺失率
   - 输出JavaScript格式的统计数据

2. **更新前端代码**: `src/LimiPreview.jsx`
   - 在 `MOCK_PREVIEW_STATS` 对象中添加空气质量数据的统计信息
   - 更新 `getColStats` 函数逻辑，确保空气质量场景使用预设统计值

### 统计数据（基于完整训练集342行）

| 字段名 | 唯一值 | 缺失率 |
|--------|--------|--------|
| Time | 342 | 0.0% |
| CO(GT) | 64 | 0.0% |
| PT08.S1(CO) | 325 | 0.0% |
| NMHC(GT) | 181 | 0.0% |
| C6H6(GT) | 326 | 0.0% |
| PT08.S2(NMHC) | 326 | 0.0% |
| NOx(GT) | 204 | 0.0% |
| PT08.S3(NOx) | 331 | 0.0% |
| NO2(GT) | 131 | 0.0% |
| PT08.S4(NO2) | 329 | 0.0% |
| PT08.S5(O3) | 333 | 0.0% |
| T | 300 | 0.0% |
| RH | 328 | 0.0% |
| AH | 342 | 0.0% |

### 文件变更

1. **新增文件**:
   - `calculate_air_stats.cjs` - 计算空气质量统计的脚本

2. **修改文件**:
   - `src/LimiPreview.jsx` - 添加空气质量统计数据到 `MOCK_PREVIEW_STATS`
   - `package.json` - 添加 `xlsx` 依赖（npm install xlsx --save-dev）

3. **删除文件**:
   - `calculate_air_unique_values.py` - 临时Python脚本（未使用）

### 验证
- ✅ 代码无linter错误
- ✅ 构建成功
- ✅ 唯一值指标现在基于完整的342行训练集数据

## 技术说明

### 为什么用Node.js而不是Python？
本项目是React/JavaScript技术栈，使用Node.js可以：
1. 保持技术栈一致性
2. 避免额外的Python依赖管理
3. 与项目现有脚本（如 `generate_air_data.cjs`）保持一致

### 如何重新计算统计数据
```bash
cd /Users/ming/Downloads/yanshi0130
node calculate_air_stats.cjs
```

### 如何构建项目
```bash
npm run build
```

### 如何本地预览
```bash
npm run dev
```
