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
            <form onSubmit={addTodo} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="Enter a new todo..."
                    className={`flex-1 px-4 py-3 rounded-lg border transition-colors duration-200 ${loading ? 'opacity-80' : ''
                        }`}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className={`px-6 py-3 bg-blue-500 text-white rounded-lg transition-all duration-200 hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin mr-2 h-4 w-4 border-4 border-current border-t-transparent" viewBox="0 0 24 24"></svg>
                            Adding...
                        </>
                    ) : 'Add Todo'}
                </button>
            </form>

            {error && (
                <div className="flex items-center gap-3 py-3 px-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <span className="text-sm font-medium text-red-700">{error}</span>
                </div>
            )}

            {loading && (
                <div className="py-4 text-center space-y-2">
                    <svg className="mx-auto animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24"></svg>
                    <p className="text-sm text-gray-600">Loading...</p>
                </div>
            )}

            <ul className="space-y-3">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <span className="mt-0.5">{todo.text}</span>
                    </li>
                ))}
            </ul>

            {todos.length === 0 && !loading && (
                <div className="py-12 text-center space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <p className="text-xl font-semibold text-gray-700">No todos yet!</p>
                    <p className="text-sm text-gray-500">Add your first todo above to get started.</p>
                </div>
            )}
        </div>
    );
}