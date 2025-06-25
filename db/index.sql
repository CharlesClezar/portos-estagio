-- ============================
-- Índices para desempenho
-- ============================
CREATE INDEX IF NOT EXISTS idx_date ON port_activity(date);
CREATE INDEX IF NOT EXISTS idx_portid ON port_activity(portid);
CREATE INDEX IF NOT EXISTS idx_country ON port_activity(country);
CREATE INDEX IF NOT EXISTS idx_type_combo ON port_activity(portid, date);