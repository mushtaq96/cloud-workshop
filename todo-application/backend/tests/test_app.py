# tests/test_app.py
import pytest
from fastapi.testclient import TestClient
from src.app import app

class BaseTestCase:
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def assert_response(self, response, expected_status, expected_data=None):
        assert response.status_code == expected_status
        if expected_data is not None:
            assert response.json() == expected_data