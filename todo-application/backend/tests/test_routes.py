# tests/test_routes.py
from test_app import BaseTestCase

class TestTodoRoutes(BaseTestCase):
    def test_get_todos(self, client):
        # Test initial empty state
        response = client.get("/api/todos")
        self.assert_response(response, 200, [])
        
        # Add a todo and verify it appears in GET
        create_response = client.post("/api/todos", json={"text": "Test todo"})
        assert create_response.status_code == 201
        
        get_response = client.get("/api/todos")
        assert len(get_response.json()) == 1
        assert get_response.json()[0]["text"] == "Test todo"
        assert isinstance(get_response.json()[0]["id"], int)
    
    def test_create_todo(self, client):
        # Test successful creation
        todo_data = {"text": "New todo"}
        response = client.post("/api/todos", json=todo_data)
        self.assert_response(response, 201)
        
        # Verify the created todo structure
        created_todo = response.json()
        assert "id" in created_todo
        assert created_todo["text"] == "New todo"
        
        # Test duplicate todo prevention
        duplicate_response = client.post("/api/todos", json=todo_data)
        self.assert_response(duplicate_response, 400)
        
        # Verify only one todo exists
        todos = client.get("/api/todos").json()
        assert len(todos) == 1