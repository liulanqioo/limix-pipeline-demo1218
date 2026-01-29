import pandas as pd
import json

def get_air_data():
    file_path = "/Users/dai/Documents/trae_projects/yanshi0125/源文件/空气质量预测训练集.xlsx"
    try:
        df = pd.read_excel(file_path)
        
        # Select columns
        cols = ["Time", "CO(GT)", "NMHC(GT)", "C6H6(GT)", "NOx(GT)", "NO2(GT)"]
        
        # Ensure columns exist
        available_cols = [c for c in cols if c in df.columns]
        df = df[available_cols]
        
        # Limit to 100 rows
        df = df.head(100)
        
        # Handle datetime
        if 'Time' in df.columns:
            # Check if Time is datetime object
            if pd.api.types.is_datetime64_any_dtype(df['Time']):
                df['Time'] = df['Time'].dt.strftime('%Y-%m-%d %H:%M:%S')
            else:
                # Try to convert and format, or leave as string if it looks like string
                # If it's already string like "2024-03-10 18:00:00", it's fine.
                # If it is integer timestamp, convert.
                pass
                
        # Handle NaN and values
        records = df.to_dict(orient='records')
        clean_records = []
        for r in records:
            new_r = {}
            for k, v in r.items():
                if pd.isna(v):
                    new_r[k] = None
                else:
                    new_r[k] = v
            clean_records.append(new_r)
            
        print(json.dumps(clean_records, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    get_air_data()
