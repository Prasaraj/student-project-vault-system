
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MyProjectsView } from "@/components/projects/MyProjectsView";
import { ProjectSubmissionForm } from "@/components/projects/ProjectSubmissionForm";
import { ProjectArchive } from "@/components/projects/ProjectArchive";
import { UserManagement } from "@/components/admin/UserManagement";
import { ReportingDashboard } from "@/components/reports/ReportingDashboard";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";
import { RubricManagement } from "@/components/rubrics/RubricManagement";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "coordinator" | "dean";
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const renderContent = () => {
    if (selectedProject) {
      return (
        <ProjectDetailView
          projectId={selectedProject}
          user={user}
          onBack={() => setSelectedProject(null)}
        />
      );
    }

    switch (currentView) {
      case "my-projects":
        return <MyProjectsView user={user} onViewProject={setSelectedProject} />;
      case "submit-project":
        return <ProjectSubmissionForm user={user} onBack={() => setCurrentView("my-projects")} />;
      case "archive":
        return <ProjectArchive user={user} onViewProject={setSelectedProject} />;
      case "users":
        return <UserManagement user={user} />;
      case "reports":
        return <ReportingDashboard user={user} />;
      case "rubrics":
        return <RubricManagement user={user} />;
      default:
        return <MyProjectsView user={user} onViewProject={setSelectedProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
