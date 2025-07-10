# tests/test_integration.py
import pytest
from fastapi.testclient import TestClient
from src.app import app

@pytest.fixture
def client():
    return TestClient(app)

def test_frontend_backend_integration(client):
    # Test todo creation
    response = client.post("/api/todos", json={"text": "Test todo"})
    assert response.status_code == 201
    
    # Verify frontend can fetch the todo
    response = client.get("/api/todos")
    assert response.status_code == 200
    assert len(response.json()) == 1