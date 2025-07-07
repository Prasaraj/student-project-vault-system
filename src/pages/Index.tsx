
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: "student" | "lecturer" | "coordinator" | "dean";
  } | null>(null);

  const handleLogin = (userData: {
    id: string;
    name: string;
    email: string;
    role: "student" | "lecturer" | "coordinator" | "dean";
  }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default Index;
