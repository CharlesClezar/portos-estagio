from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os

def executar_sql(session, path):
    print(f"📄 Executando SQL de: {path}")
    with open(path, "r", encoding="utf-8") as f:
        sql = f.read()
        session.execute(text(sql))
        session.commit()

DATABASE_URL = os.getenv("DATABASE_URL")
print("🔌 Conectando ao banco:", DATABASE_URL)

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

executar_sql(session, "/db/index.sql")
executar_sql(session, "/db/views.sql")

session.close()
print("✅ Views e índices aplicados com sucesso.")
