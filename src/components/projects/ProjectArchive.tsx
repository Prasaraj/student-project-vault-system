
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Calendar, User, Award, ExternalLink, Grid, List } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "coordinator" | "dean";
}

interface ProjectArchiveProps {
  user: User;
  onViewProject: (projectId: string) => void;
}

// Mock data for approved projects in the archive
const mockArchiveProjects = [
  {
    id: "1",
    title: "AI-Powered Learning Management System",
    type: "Capstone",
    impact: "High",
    description: "A comprehensive learning management system enhanced with artificial intelligence to personalize learning experiences and provide intelligent tutoring.",
    students: ["John Student", "Jane Doe", "Alex Kim"],
    advisor: "Dr. Sarah Lecturer",
    completionDate: "2024-03-15",
    keywords: ["AI", "Machine Learning", "Education", "LMS"],
    year: "2024",
    semester: "Spring",
    externalLinks: ["https://github.com/project/ai-lms", "https://demo.ai-lms.edu"]
  },
  {
    id: "2",
    title: "Blockchain-Based Supply Chain Tracking",
    type: "Competition Work",
    impact: "High",
    description: "Innovative blockchain solution for transparent supply chain tracking, winning first place at the National Tech Innovation Competition.",
    students: ["Mike Wilson", "Sarah Chen"],
    advisor: "Prof. David Tech",
    completionDate: "2024-02-20",
    keywords: ["Blockchain", "Supply Chain", "Web3", "Transparency"],
    year: "2024",
    semester: "Spring",
    award: "1st Place - National Tech Innovation Competition",
    externalLinks: ["https://github.com/blockchain-supply"]
  },
  {
    id: "3",
    title: "Mental Health Support Mobile App",
    type: "Social Service",
    impact: "Medium",
    description: "Mobile application providing mental health resources and peer support for university students, serving over 1000 students.",
    students: ["Emily Rodriguez", "James Park"],
    advisor: "Dr. Lisa Psychology",
    completionDate: "2023-12-10",
    keywords: ["Mental Health", "Mobile App", "Social Service", "Support"],
    year: "2023",
    semester: "Fall",
    beneficiaryOrganization: "University Counseling Center",
    externalLinks: ["https://mentalhealthapp.university.edu"]
  },
  {
    id: "4",
    title: "Renewable Energy Optimization Algorithm",
    type: "Academic Publication",
    impact: "High",
    description: "Novel optimization algorithm for renewable energy distribution, published in IEEE Transactions on Smart Grid.",
    students: ["Robert Green", "Anna Solar"],
    advisor: "Prof. Energy Expert",
    completionDate: "2023-11-15",
    keywords: ["Renewable Energy", "Optimization", "Smart Grid", "Algorithm"],
    year: "2023",
    semester: "Fall",
    publicationVenue: "IEEE Transactions on Smart Grid",
    doi: "https://doi.org/10.1109/TSG.2023.example",
    externalLinks: ["https://github.com/renewable-optimization"]
  },
  {
    id: "5",
    title: "Augmented Reality Campus Navigation",
    type: "Capstone",
    impact: "Medium",
    description: "AR-based navigation system to help new students and visitors navigate the university campus with interactive 3D directions.",
    students: ["Chris AR", "Diana Virtual"],
    advisor: "Dr. Computer Vision",
    completionDate: "2023-05-20",
    keywords: ["Augmented Reality", "Navigation", "Mobile", "Campus"],
    year: "2023",
    semester: "Spring",
    externalLinks: ["https://ar-navigation.university.edu"]
  },
];

export const ProjectArchive = ({ user, onViewProject }: ProjectArchiveProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [impactFilter, setImpactFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-purple-100 text-purple-800";
      case "Medium":
        return "bg-blue-100 text-blue-800";
      case "Low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProjects = mockArchiveProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         project.students.some(student => student.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         project.advisor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || project.type === typeFilter;
    const matchesYear = yearFilter === "all" || project.year === yearFilter;
    const matchesImpact = impactFilter === "all" || project.impact === impactFilter;
    
    return matchesSearch && matchesType && matchesYear && matchesImpact;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Project Archive</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            {filteredProjects.length} approved project(s) found
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects, keywords, authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Capstone">Capstone</SelectItem>
            <SelectItem value="Competition Work">Competition Work</SelectItem>
            <SelectItem value="Academic Publication">Academic Publication</SelectItem>
            <SelectItem value="Social Service">Social Service</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>

        <Select value={impactFilter} onValueChange={setImpactFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by impact" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Impact Levels</SelectItem>
            <SelectItem value="High">High Impact</SelectItem>
            <SelectItem value="Medium">Medium Impact</SelectItem>
            <SelectItem value="Low">Low Impact</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects View */}
      {viewMode === "grid" ? (
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
                {/* Impact and Year */}
                <div className="flex justify-between items-center">
                  <Badge className={getImpactColor(project.impact)}>
                    <Award className="w-3 h-3 mr-1" />
                    {project.impact} Impact
                  </Badge>
                  <Badge variant="outline">
                    {project.semester} {project.year}
                  </Badge>
                </div>

                {/* Project Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span className="line-clamp-1">{project.students.join(", ")}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      Completed: {new Date(project.completionDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1">
                  {project.keywords.slice(0, 3).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {project.keywords.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.keywords.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* External Links */}
                {project.externalLinks && project.externalLinks.length > 0 && (
                  <div className="flex items-center text-sm text-blue-600">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    <span>{project.externalLinks.length} external link(s)</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onViewProject(project.id)}
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Advisor</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-xs">
                      <div className="font-semibold">{project.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-2">{project.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="line-clamp-2">{project.students.join(", ")}</div>
                  </TableCell>
                  <TableCell>{project.advisor}</TableCell>
                  <TableCell>
                    <Badge className={getImpactColor(project.impact)}>
                      {project.impact}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(project.completionDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {project.semester} {project.year}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {project.keywords.slice(0, 2).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {project.keywords.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.keywords.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => onViewProject(project.id)}
                      size="sm"
                      variant="outline"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No projects found</div>
          <p className="text-gray-500 mt-2">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
};
