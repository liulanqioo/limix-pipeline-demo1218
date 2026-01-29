import pandas as pd
import json

def get_air_quality_trends():
    file_path = "/Users/dai/Documents/trae_projects/yanshi0125/源文件/空气质量预测测试集.xlsx"
    try:
        df = pd.read_excel(file_path)
        
        # Ensure Time column exists and is parsed
        time_col = None
        for col in df.columns:
            if 'Time' in col or 'Date' in col:
                time_col = col
                break
        
        if not time_col:
            print(json.dumps({"error": "No time column found"}))
            return

        # Ensure datetime
        if not pd.api.types.is_datetime64_any_dtype(df[time_col]):
            df[time_col] = pd.to_datetime(df[time_col], errors='coerce')
            
        # Target columns
        targets = ['CO(GT)', 'NMHC(GT)', 'C6H6(GT)', 'NOx(GT)', 'NO2(GT)']
        
        # Filter by date range 2024/3/25 00:00 to 2024/3/31 23:00
        start_date = pd.to_datetime("2024-03-25 00:00:00")
        end_date = pd.to_datetime("2024-03-31 23:00:00")
        
        mask = (df[time_col] >= start_date) & (df[time_col] <= end_date)
        df_filtered = df.loc[mask].copy()
        
        # Select columns
        cols_to_keep = [time_col] + [col for col in targets if col in df.columns]
        result_df = df_filtered[cols_to_keep].copy()
        
        # Rename time column for consistency
        result_df.rename(columns={time_col: 'Time'}, inplace=True)
        
        # Format date
        result_df['Time'] = result_df['Time'].dt.strftime('%Y-%m-%d %H:%M')
        
        # Handle NaN/missing values (-200 is often used as missing value in this dataset)
        for col in result_df.columns:
            if col != 'Time':
                result_df[col] = result_df[col].apply(lambda x: None if pd.isna(x) or x == -200 else x)
        
        records = result_df.to_dict(orient='records')
        print(json.dumps(records, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    get_air_quality_trends()
