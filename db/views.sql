
-- ============================
-- View: Resumo dos cards
-- ============================
CREATE OR REPLACE VIEW vw_dashboard_resumo AS
SELECT
  SUM("import" + "export") AS volume_total,
  SUM(portcalls) AS chamadas,
  COUNT(DISTINCT portid) AS total_portos,
  ROUND(AVG("import" + "export")::numeric, 2) AS media_volume
FROM port_activity;

-- ============================
-- View: Volume ao longo do tempo
-- ============================
CREATE OR REPLACE VIEW vw_volume_diario AS
SELECT
  date,
  SUM(import_container + export_container) AS container,
  SUM(import_dry_bulk + export_dry_bulk) AS granel,
  SUM(import_tanker + export_tanker) AS liquido
FROM port_activity
GROUP BY date
ORDER BY date;

-- ============================
-- View: Chamadas ao longo do tempo
-- ============================
CREATE OR REPLACE VIEW vw_chamadas_diarias AS
SELECT
  date,
  SUM(portcalls) AS chamadas
FROM port_activity
GROUP BY date
ORDER BY date;

-- ============================
-- View: Distribuição por tipo de embarcação
-- ============================
CREATE OR REPLACE VIEW vw_distribuicao_tipos AS
SELECT
  SUM(portcalls_container) AS container,
  SUM(portcalls_dry_bulk) AS granel,
  SUM(portcalls_tanker) AS tanque,
  SUM(portcalls_general_cargo + portcalls_roro) AS outros
FROM port_activity;

-- ============================
-- View: Top 10 portos por volume
-- ============================
CREATE OR REPLACE VIEW vw_top10_portos_volume AS
SELECT
  portid,
  portname,
  SUM("import" + "export") AS volume_total
FROM port_activity
GROUP BY portid, portname
ORDER BY volume_total DESC
LIMIT 10;
