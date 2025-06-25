import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_get_resumo():
    response = client.get("/dashboard/resumo")
    assert response.status_code == 200
    data = response.json()

    # Verifica se as chaves esperadas estão presentes
    assert "volume_total" in data
    assert "chamadas" in data
    assert "total_portos" in data
    assert "media_volume" in data

    # Verifica os tipos dos dados
    assert isinstance(data["volume_total"], float)
    assert isinstance(data["chamadas"], int)
    assert isinstance(data["total_portos"], int)
    assert isinstance(data["media_volume"], float)
