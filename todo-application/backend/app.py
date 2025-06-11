# backend/app.py
from fastapi import FastAPI # type: ignore
from fastapi.responses import JSONResponse # type: ignore
from pydantic import BaseModel # type: ignore
import json
import os

# initialize FastAPI app
app = FastAPI()

# Define pydantic models
class TodoCreate(BaseModel):
    text: str
class Todo(TodoCreate):
    id: int

# Simple in-memory storage for demo purposes
todos = [
    {"id": 1, "text": "Erste Aufgabe"},
    {"id": 2, "text": "Zweite Aufgabe"}
]

# Endpoint to get all todos
@app.get("/api/todos")
async def get_todos():
    return todos

# Endpoint to create a new todo
@app.post("/api/todos", response_model = Todo)
async def create_todo(todo: TodoCreate):
    new_todo = {"id": get_next_id(), "text": todo.text}
    todos.append(new_todo)
    return JSONResponse(content=new_todo, status_code=201)

# Helper function to get the next ID for a new todo
def get_next_id():
    if todos:
        id = max(t["id"] for t in todos) + 1
    else:
        id = 1
    return id

if __name__ == "__main__":
    import uvicorn # type: ignore
    uvicorn.run(app, host="0.0.0.0", port=8000)