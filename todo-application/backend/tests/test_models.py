# tests/test_models.py
from app import TodoCreate, Todo

class TestTodoModel:
    def test_todo_creation(self):
        todo_data = {"text": "Test todo"}
        todo = TodoCreate(**todo_data)
        
        assert todo.text == todo_data["text"]
        
        # Test backward compatibility
        assert hasattr(todo, "text")
        assert isinstance(todo.text, str)
        
    def test_todo_validation(self):
        # Empty strings are currently allowed
        todo = TodoCreate(text="")
        assert todo.text == ""
        
        # Test valid data
        todo = TodoCreate(text="Valid todo")
        assert todo.text == "Valid todo"