import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface Todo {
    id: number;
    text: string;
}

export function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoText, setNewTodoText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch todos on mount and refresh
    useEffect(() => {
        loadTodos();
    }, []);

    async function loadTodos() {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/todos');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTodos(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load todos');
        } finally {
            setLoading(false);
        }
    }

    async function addTodo(e: React.FormEvent) {
        e.preventDefault();

        if (!newTodoText.trim()) {
            setError('Todo text cannot be empty');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: newTodoText }),
            });
            console.log('Response:', response);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error data:', errorData);
                throw new Error(errorData.detail || "Failed to add todo");
            }

            const todo = await response.json();
            setTodos([...todos, todo]);
            setNewTodoText('');
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add todo');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 space-y-6">
            <form onSubmit={addTodo} className="flex gap-2">
                <input
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="Enter a new todo..."
                    className="flex-1 px-3 py-2 border rounded-md"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className={`px-4 py-2 bg-blue-500 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                        }`}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Todo'}
                </button>
            </form>

            {error && (
                <div className="flex items-center gap-2 text-red-500 bg-red-100 rounded-md p-3">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}

            {loading && (
                <div className="text-center text-gray-500">Loading...</div>
            )}

            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li key={todo.id} className="flex items-center gap-2">
                        <span>{todo.text}</span>
                    </li>
                ))}
            </ul>

            {todos.length === 0 && !loading && (
                <div className="text-center text-gray-500">No todos found</div>
            )}
        </div>
    );
}