from sqlalchemy import (
    Column, Integer, String, Float, Date, Index
)
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class PortActivity(Base):
    __tablename__ = "port_activity"

    ObjectId = Column(Integer, primary_key=True)

    date = Column(Date, index=True)
    year = Column(Integer)
    month = Column(Integer)
    day = Column(Integer)

    portid = Column(String, index=True)
    portname = Column(String)
    country = Column(String)
    ISO3 = Column(String)

    portcalls_container = Column(Integer)
    portcalls_dry_bulk = Column(Integer)
    portcalls_general_cargo = Column(Integer)
    portcalls_roro = Column(Integer)
    portcalls_tanker = Column(Integer)
    portcalls_cargo = Column(Integer)
    portcalls = Column(Integer)

    import_container = Column(Float)
    import_dry_bulk = Column(Float)
    import_general_cargo = Column(Float)
    import_roro = Column(Float)
    import_tanker = Column(Float)
    import_cargo = Column(Float)
    import_ = Column("import", Float)

    export_container = Column(Float)
    export_dry_bulk = Column(Float)
    export_general_cargo = Column(Float)
    export_roro = Column(Float)
    export_tanker = Column(Float)
    export_cargo = Column(Float)
    export_ = Column("export", Float)

    __table_args__ = (
        Index("ix_country_date", "country", "date"),
    )
