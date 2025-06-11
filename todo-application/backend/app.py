# backend/app.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
import os

app = FastAPI()

class Todo(BaseModel):
    id: int
    text: str

# Simple in-memory storage for demo purposes
todos = [
    {"id": 1, "text": "Erste Aufgabe"},
    {"id": 2, "text": "Zweite Aufgabe"}
]

@app.get("/api/todos")
async def get_todos():
    return todos

@app.post("/api/todos")
async def create_todo(todo_text: dict):
    new_id = max(t["id"] for t in todos) + 1
    new_todo = {"id": new_id, "text": todo_text["text"]}
    todos.append(new_todo)
    return JSONResponse(content=new_todo, status_code=201)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)