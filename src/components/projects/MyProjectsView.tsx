
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Edit, Calendar, User, Award } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "coordinator" | "dean";
}

interface MyProjectsViewProps {
  user: User;
  onViewProject: (projectId: string) => void;
}

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    title: "AI-Powered Learning Management System",
    type: "Capstone",
    status: "Approved",
    submissionDate: "2024-03-15",
    lastModified: "2024-03-20",
    impact: "High",
    description: "A comprehensive learning management system enhanced with artificial intelligence...",
    students: ["John Student", "Jane Doe"],
    advisor: "Dr. Sarah Lecturer",
  },
  {
    id: "2",
    title: "Mobile App for Community Gardens",
    type: "Social Service",
    status: "Under Review",
    submissionDate: "2024-06-10",
    lastModified: "2024-06-15",
    impact: "Medium",
    description: "Mobile application to connect community members with local gardens...",
    students: ["John Student"],
    advisor: "Dr. Sarah Lecturer",
  },
  {
    id: "3",
    title: "Blockchain Voting System",
    type: "Competition Work",
    status: "Draft",
    submissionDate: "",
    lastModified: "2024-07-01",
    impact: "",
    description: "Secure and transparent voting system using blockchain technology...",
    students: ["John Student", "Mike Wilson"],
    advisor: "Dr. Sarah Lecturer",
  },
];

export const MyProjectsView = ({ user, onViewProject }: MyProjectsViewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-purple-100 text-purple-800";
      case "Medium":
        return "bg-blue-100 text-blue-800";
      case "Low":
        return "bg-gray-100 text-gray-800";
      default:
        return "";
    }
  };

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getViewTitle = () => {
    switch (user.role) {
      case "student":
        return "My Projects";
      case "lecturer":
        return "Advisee Projects";
      case "coordinator":
        return "All Projects";
      default:
        return "Projects";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">{getViewTitle()}</h2>
        <div className="text-sm text-gray-500">
          {filteredProjects.length} project(s) found
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                <Badge variant="outline" className="shrink-0 ml-2">
                  {project.type}
                </Badge>
              </div>
              <CardDescription className="line-clamp-3">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status and Impact */}
              <div className="flex justify-between items-center">
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                {project.impact && (
                  <Badge className={getImpactColor(project.impact)}>
                    <Award className="w-3 h-3 mr-1" />
                    {project.impact} Impact
                  </Badge>
                )}
              </div>

              {/* Project Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{project.students.join(", ")}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {project.submissionDate ? 
                      `Submitted: ${new Date(project.submissionDate).toLocaleDateString()}` :
                      `Modified: ${new Date(project.lastModified).toLocaleDateString()}`
                    }
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => onViewProject(project.id)}
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                {project.status === "Draft" && user.role === "student" && (
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No projects found</div>
          <p className="text-gray-500 mt-2">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search criteria"
              : "No projects have been submitted yet"
            }
          </p>
        </div>
      )}
    </div>
  );
};
