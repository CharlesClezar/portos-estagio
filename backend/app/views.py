from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db import get_db

router = APIRouter()

@router.get("/dashboard/resumo")
def get_resumo(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM vw_dashboard_resumo")).mappings().fetchone()
    return {
        "volume_total": float(result["volume_total"]),
        "chamadas": int(result["chamadas"]),
        "total_portos": int(result["total_portos"]),
        "media_volume": float(result["media_volume"]),
    }

@router.get("/dashboard/volume-diario")
def get_volume_diario(
    start: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end: str = Query(..., description="Data final (YYYY-MM-DD)"),
    portid: str = Query(None, description="Código do porto (opcional)"),
    db: Session = Depends(get_db)
):
    base_sql = """
        SELECT date,
               SUM(import_container + export_container) AS container,
               SUM(import_dry_bulk + export_dry_bulk) AS granel,
               SUM(import_tanker + export_tanker) AS liquido
        FROM port_activity
        WHERE date BETWEEN :start AND :end
    """
    params = {"start": start, "end": end}

    if portid:
        base_sql += " AND portid = :portid"
        params["portid"] = portid

    base_sql += " GROUP BY date ORDER BY date"

    result = db.execute(text(base_sql), params).mappings().fetchall()
    return [
        {
            "date": row["date"].isoformat(),
            "container": float(row["container"]),
            "granel": float(row["granel"]),
            "liquido": float(row["liquido"])
        }
        for row in result
    ]

@router.get("/dashboard/chamadas-diarias")
def get_chamadas_diarias(
    start: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end: str = Query(..., description="Data final (YYYY-MM-DD)"),
    portid: str = Query(None, description="Código do porto (opcional)"),
    db: Session = Depends(get_db)
):
    base_sql = """
        SELECT date,
               SUM(portcalls) AS chamadas
        FROM port_activity
        WHERE date BETWEEN :start AND :end
    """
    params = {"start": start, "end": end}

    if portid:
        base_sql += " AND portid = :portid"
        params["portid"] = portid

    base_sql += " GROUP BY date ORDER BY date"

    result = db.execute(text(base_sql), params).mappings().fetchall()
    return [
        {
            "date": row["date"].isoformat(),
            "chamadas": int(row["chamadas"])
        }
        for row in result
    ]

@router.get("/dashboard/tipos")
def get_distribuicao_tipos(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM vw_distribuicao_tipos")).mappings().fetchone()
    return {
        "container": int(result["container"]),
        "granel": int(result["granel"]),
        "tanque": int(result["tanque"]),
        "outros": int(result["outros"])
    }

@router.get("/dashboard/top-portos")
def get_top_portos(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM vw_top10_portos_volume")).mappings().fetchall()
    return [
        {
            "portid": row["portid"],
            "portname": row["portname"],
            "volume_total": float(row["volume_total"])
        }
        for row in result
    ]

@router.get("/ports")
def search_ports(
    search: str = Query(..., description="Busca por código ou nome do porto"),
    db: Session = Depends(get_db)
):
    sql = text("""
        SELECT DISTINCT portid, portname
        FROM port_activity
        WHERE portid ILIKE :search OR portname ILIKE :search
        ORDER BY portname
        LIMIT 20
    """)
    result = db.execute(sql, {"search": f"%{search}%"}).mappings().fetchall()
    return [
        {
            "portid": row["portid"],
            "portname": row["portname"]
        }
        for row in result
    ]
