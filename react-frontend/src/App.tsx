// src/App.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import TodoApp from "./TodoApp"; // your todos component

// Define a type for user
type User = {
  name: string;
  provider: "github" | "google";
};

export default function App() {
  const [authLoading, setAuthLoading] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  const handleSocialLogin = async (provider: "github" | "google") => {
    setAuthLoading(true);
    try {
      // Fake login simulation
      setTimeout(() => {
        setUser({ name: "Test User", provider });
        setAuthLoading(false);
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    // Add logout logic here later
    window.location.reload();
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400 animate-spin" />
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome to ToDo App
            </CardTitle>
            <p className="text-gray-600">Sign in to manage your tasks</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleSocialLogin("github")}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              Continue with GitHub
            </Button>
            <Button
              onClick={() => handleSocialLogin("google")}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated → show Todo app
  // Temporarily bypass auth with mock user
  const mockUser = { name: "Test User", provider: "github" };

  return <TodoApp user={mockUser} onLogout={handleLogout} />;
}
