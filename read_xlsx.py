import pandas as pd
import json

def read_xlsx(file_path):
    try:
        # Read full file to get count
        df_full = pd.read_excel(file_path)
        total_rows = len(df_full)
        
        # Take first 10 rows for preview
        df = df_full.head(10)
        
        # Convert Timestamp to string to make it JSON serializable
        df = df.astype(object)
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]):
                df[col] = df[col].dt.strftime('%Y-%m-%d %H:%M:%S')
            # Check if values are datetime objects (sometimes object dtype contains datetime)
            elif df[col].apply(lambda x: isinstance(x, pd.Timestamp)).any():
                 df[col] = df[col].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S') if pd.notnull(x) and isinstance(x, pd.Timestamp) else x)
            # Check for datetime.time objects
            elif df[col].apply(lambda x: hasattr(x, 'strftime')).any():
                 df[col] = df[col].apply(lambda x: x.strftime('%H:%M:%S') if pd.notnull(x) and hasattr(x, 'strftime') else x)

        
        records = df.to_dict(orient='records')
        # Handle NaN values which are not valid JSON
        records = [{k: (v if pd.notna(v) else None) for k, v in r.items()} for r in records]
        
        # Calculate time range
        time_col = None
        for col in df_full.columns:
            if 'Time' in col or 'Date' in col or 'time' in col or 'date' in col:
                time_col = col
                break
        
        time_range = "-"
        if time_col:
            try:
                # Ensure datetime
                if not pd.api.types.is_datetime64_any_dtype(df_full[time_col]):
                    df_full[time_col] = pd.to_datetime(df_full[time_col], errors='coerce')
                
                min_time = df_full[time_col].min()
                max_time = df_full[time_col].max()
                if pd.notnull(min_time) and pd.notnull(max_time):
                    time_range = f"{min_time.strftime('%Y-%m-%d')} ~ {max_time.strftime('%Y-%m-%d')}"
            except:
                pass

        return records, list(df.columns), total_rows, time_range
    except Exception as e:
        return str(e), [], 0, "-"

train_file = "/Users/dai/Documents/trae_projects/yanshi0125/源文件/空气质量预测训练集.xlsx"
test_file = "/Users/dai/Documents/trae_projects/yanshi0125/源文件/空气质量预测测试集.xlsx"

train_data, train_cols, train_count, train_range = read_xlsx(train_file)
test_data, test_cols, test_count, test_range = read_xlsx(test_file)

output = {
    "train": {"columns": train_cols, "data": train_data, "count": train_count, "range": train_range},
    "test": {"columns": test_cols, "data": test_data, "count": test_count, "range": test_range}
}

print(json.dumps(output, ensure_ascii=False, indent=2, default=str))
