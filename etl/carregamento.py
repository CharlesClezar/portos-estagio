import os
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, PortActivity
import traceback

try:
    csv_path = "Daily_Port_Activity_Data_and_Trade_Estimates.CSV"
    df = pd.read_csv(csv_path)
    print("CSV carregado.")

    df["date"] = pd.to_datetime(df["date"], errors="coerce")

    DATABASE_URL = os.getenv("DATABASE_URL")
    print("Conectando ao banco")
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    Base.metadata.create_all(engine)
    print("Tabela criada (se necessário).")

    records = df.to_dict(orient="records")
    for r in records:
        r["import_"] = r.pop("import")
        r["export_"] = r.pop("export")

    print("Inserindo no banco, aguarde")
    session.bulk_insert_mappings(PortActivity, records)
    session.commit()
    print("Dados inseridos com sucesso!")

except Exception as e:
    print("Erro durante o carregamento:")
    traceback.print_exc()
    session.rollback()
finally:
    session.close()
    print("Conexão encerrada.")