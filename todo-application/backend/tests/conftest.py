import pytest
import json

@pytest.fixture(autouse=True)
def reset_todos_file():
    # Reset todos.json to an empty list before each test
    filename = "todos.json"
    with open(filename, "w") as f:
        json.dump([], f)
    yield
