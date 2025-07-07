
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";

interface LoginFormProps {
  onLogin: (user: {
    id: string;
    name: string;
    email: string;
    role: "student" | "lecturer" | "coordinator" | "dean";
  }) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in a real app, this would be handled by your backend
    const mockUsers = {
      "student@university.edu": { id: "1", name: "John Student", role: "student" as const },
      "lecturer@university.edu": { id: "2", name: "Dr. Sarah Lecturer", role: "lecturer" as const },
      "coordinator@university.edu": { id: "3", name: "Prof. Mike Coordinator", role: "coordinator" as const },
      "dean@university.edu": { id: "4", name: "Dr. Lisa Dean", role: "dean" as const },
    };

    const user = mockUsers[email as keyof typeof mockUsers];
    if (user) {
      onLogin({
        ...user,
        email,
      });
    } else {
      alert("Invalid credentials. Try: student@university.edu, lecturer@university.edu, coordinator@university.edu, or dean@university.edu");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Student Project Archive
          </CardTitle>
          <CardDescription>
            Sign in to access your academic projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium">Demo accounts:</p>
            <p>• student@university.edu</p>
            <p>• lecturer@university.edu</p>
            <p>• coordinator@university.edu</p>
            <p>• dean@university.edu</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
