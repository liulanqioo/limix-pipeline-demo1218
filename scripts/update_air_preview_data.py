import pandas as pd
import json
import os

def convert_excel_to_js(excel_path, js_path, variable_name, limit=None):
    print(f"Reading {excel_path}...")
    try:
        df = pd.read_excel(excel_path)
        
        # 处理 NaN 值，将其转换为 None 或空字符串，以便 JSON 序列化
        df = df.where(pd.notnull(df), None)
        
        # 转换时间列为字符串（如果存在）
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]):
                df[col] = df[col].dt.strftime('%Y-%m-%d %H:%M:%S')
        
        records = df.to_dict(orient='records')
        
        if limit:
            records = records[:limit]
            print(f"Limiting to first {limit} rows.")
            
        json_str = json.dumps(records, ensure_ascii=False, indent=2)
        
        # 处理 JSON 中的 null，将其替换为 null 或者空字符串，视前端需求而定
        # 这里保持 null，React 通常能处理 null
        
        js_content = f"export const {variable_name} = {json_str};\n"
        
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        print(f"Successfully wrote to {js_path}")
        
    except Exception as e:
        print(f"Error processing {excel_path}: {e}")

# 路径配置
base_dir = os.getcwd()
source_dir = os.path.join(base_dir, "源文件")
target_dir = os.path.join(base_dir, "src", "data")

# 1. 清洗后训练集
file1 = os.path.join(source_dir, "空气质量预测训练集清洗1.xlsx")
target1 = os.path.join(target_dir, "air_cleaned_preview.js")
convert_excel_to_js(file1, target1, "AIR_CLEANED_PREVIEW", limit=200) # 限制行数以避免文件过大

# 2. 清洗后测试集 (源文件/空气质量预测测试集.xlsx)
file2 = os.path.join(source_dir, "空气质量预测测试集.xlsx")
target2 = os.path.join(target_dir, "air_test_preview.js")
convert_excel_to_js(file2, target2, "AIR_TEST_PREVIEW", limit=200)

