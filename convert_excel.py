import pandas as pd
import glob
import json
import unicodedata
import re

def normalize_column_name(col):
    col = str(col).strip().upper()
    col = ''.join(c for c in unicodedata.normalize('NFD', col) if unicodedata.category(c) != 'Mn')
    col = col.replace('%', 'PERCENTUAL')
    col = re.sub(r'[^A-Z0-9]+', '_', col)
    return col.strip('_')

def main():
    files = glob.glob('*.xlsb')
    if not files:
        print("Nenhum arquivo .xlsb encontrado no repositório.")
        return
    
    file_path = files[0]
    print(f"Lendo o arquivo: {file_path}")
    
    try:
        df = pd.read_excel(file_path, sheet_name="OBRAS PAC (SEINFRA UFG)", engine='pyxlsb')
    except Exception as e:
        print(f"Erro ao ler o arquivo excel: {e}")
        return
        
    df.columns = [normalize_column_name(c) for c in df.columns]
    
    # Replace NaNs with None for valid JSON nulls
    # Cast to object to prevent pandas from converting None back to NaN in float columns
    df = df.astype(object).where(pd.notnull(df), None)
    
    data = df.to_dict(orient='records')
    
    output_file = 'dados_obras.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"Arquivo {output_file} gerado com sucesso!")

if __name__ == "__main__":
    main()
