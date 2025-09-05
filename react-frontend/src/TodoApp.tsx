import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Clock, AlertCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';

// Add Todo type
type Todo = {
    id: number;
    title: string;
    completed: boolean;
    created_at: string;
};

type Props = {
    user: { name: string; provider: string };
    onLogout?: () => void;
};

const TodoApp = ({ user, onLogout }: Props) => {
    // Use Todo[] for todos state
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Mock API functions - replace with actual API calls
    const mockTodos: Todo[] = [
        { id: 1, title: 'Learn React', completed: false, created_at: new Date().toISOString() },
        { id: 2, title: 'Build Todo App', completed: false, created_at: new Date().toISOString() },
        { id: 3, title: 'Deploy to production', completed: false, created_at: new Date().toISOString() }
    ];

    useEffect(() => {
        // Simulate loading todos from API
        setLoading(true);
        setTimeout(() => {
            setTodos(mockTodos);
            setLoading(false);
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addTodo = async () => {
        if (!newTodo.trim()) return;

        setLoading(true);
        try {
            // Replace with actual API call
            const todo: Todo = {
                id: Date.now(),
                title: newTodo,
                completed: false,
                created_at: new Date().toISOString()
            };

            setTodos(prev => [todo, ...prev]);
            setNewTodo('');
            setError('');
        } catch {
            setError('Failed to add todo');
        } finally {
            setLoading(false);
        }
    };

    // Type id as number
    const toggleTodo = async (id: number) => {
        try {
            setTodos(prev =>
                prev.map(todo =>
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo
                )
            );
        } catch {
            setError('Failed to update todo');
        }
    };

    // Type id as number
    const deleteTodo = async (id: number) => {
        try {
            setTodos(prev => prev.filter(todo => todo.id !== id));
        } catch {
            setError('Failed to delete todo');
        }
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'completed') return todo.completed;
        if (filter === 'pending') return !todo.completed;
        return true;
    });

    const completedCount = todos.filter(todo => todo.completed).length;
    const pendingCount = todos.length - completedCount;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <Card className="mb-8">
                    <CardHeader className="text-center relative">
                        <div className="absolute right-4 top-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onLogout}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Logout
                            </Button>
                        </div>
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            ToDo App
                        </CardTitle>
                        <p className="text-gray-600">Welcome, {user.name}</p>
                    </CardHeader>
                </Card>

                {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Add Todo Form */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a new todo..."
                                value={newTodo}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value)}
                                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addTodo()}
                                className="flex-1"
                                disabled={loading}
                            />
                            <Button
                                onClick={addTodo}
                                disabled={loading || !newTodo.trim()}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card className="text-center">
                        <CardContent className="pt-4 pb-4">
                            <div className="text-2xl font-bold text-gray-900">{todos.length}</div>
                            <div className="text-sm text-gray-600">Total</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="pt-4 pb-4">
                            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                            <div className="text-sm text-gray-600">Completed</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="pt-4 pb-4">
                            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-6 justify-center">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        size="sm"
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'pending' ? 'default' : 'outline'}
                        onClick={() => setFilter('pending')}
                        size="sm"
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === 'completed' ? 'default' : 'outline'}
                        onClick={() => setFilter('completed')}
                        size="sm"
                    >
                        Completed
                    </Button>
                </div>

                {/* Todo List */}
                <div className="space-y-3">
                    {loading && todos.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400 animate-spin" />
                                <p className="text-gray-600">Loading todos...</p>
                            </CardContent>
                        </Card>
                    ) : filteredTodos.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <p className="text-gray-600">
                                    {filter === 'all'
                                        ? "No todos yet. Add one above!"
                                        : `No ${filter} todos.`
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredTodos.map(todo => (
                            <Card
                                key={todo.id}
                                className={`transition-all duration-200 hover:shadow-md ${todo.completed ? 'bg-green-50 border-green-200' : ''
                                    }`}
                            >
                                <CardContent className="pt-4 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleTodo(todo.id)}
                                                className={`p-1 rounded-full ${todo.completed
                                                    ? 'text-green-600 bg-green-100 hover:bg-green-200'
                                                    : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                                    }`}
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                            <div className="flex-1">
                                                <p className={`${todo.completed
                                                    ? 'line-through text-gray-500'
                                                    : 'text-gray-900'
                                                    }`}>
                                                    {todo.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(todo.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge
                                                variant={todo.completed ? "secondary" : "secondary"}
                                                className={todo.completed ? "bg-green-100 text-green-800" : ""}
                                            >
                                                {todo.completed ? 'Done' : 'Pending'}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteTodo(todo.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Footer */}
                {/* <Card className="mt-8">
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-sm text-gray-500">
              Built with React + Vite + shadcn/ui
            </p>
          </CardContent>
        </Card> */}
            </div>
        </div>
    );
};

export default TodoApp;