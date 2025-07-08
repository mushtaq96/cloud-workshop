# backend/app.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
import os

# Initialize FastAPI app
app = FastAPI()

# Define pydantic models
class TodoCreate(BaseModel):
    text: str
class Todo(TodoCreate):
    id: int

# Define filename for storing todos
FILENAME = "todos.json"

# Helper functions
# Function to read todos from the JSON file
def read_todos():
    try:
        # Try to read existing file
        with open(FILENAME, 'r') as f:
            todos = json.load(f)
            if not isinstance(todos, list):  # Verify it's a list
                raise ValueError("Invalid data format")
            return todos
    except (FileNotFoundError, json.JSONDecodeError, ValueError):
        # If any error occurs, initialize a clean file
        with open(FILENAME, 'w') as f:
            json.dump([], f)
        return []  # Always return a list

# Function to get the next ID for a new todo
def get_next_id():
    todos = read_todos()
    if todos:
        id = max(t["id"] for t in todos) + 1
    else:
        id = 1
    return id

# Endpoint to get all todos
@app.get("/api/todos")
async def get_todos():
    todos = read_todos()
    return todos

# Endpoint to create a new todo
@app.post("/api/todos", response_model = Todo)
async def create_todo(todo: TodoCreate):
    # Initialize todos list from file
    todos = read_todos()
    
    if any(t["text"] == todo.text for t in todos):
        raise HTTPException(status_code=400, detail="Todo already exists")
    new_todo = {"id": get_next_id(), "text": todo.text}
    todos.append(new_todo)
    # Write updated todos back to file
    with open(FILENAME, "w") as file:
        json.dump(todos, file, indent=2)
    return JSONResponse(content=new_todo, status_code=201)



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)