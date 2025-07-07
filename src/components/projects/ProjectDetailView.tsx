
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  User, 
  Calendar, 
  Award,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "coordinator" | "dean";
}

interface ProjectDetailViewProps {
  projectId: string;
  user: User;
  onBack: () => void;
}

// Mock project data (in a real app, this would be fetched from API)
const mockProject = {
  id: "1",
  title: "AI-Powered Learning Management System",
  type: "Capstone",
  status: "Approved",
  impact: "High",
  description: "A comprehensive learning management system enhanced with artificial intelligence to personalize learning experiences and provide intelligent tutoring. The system uses machine learning algorithms to adapt to individual learning styles, recommend content, and provide real-time feedback to both students and instructors. The project includes features such as automated grading, plagiarism detection, interactive chatbots for student support, and analytics dashboards for tracking student progress.",
  students: ["John Student", "Jane Doe", "Alex Kim"],
  advisor: "Dr. Sarah Lecturer",
  submissionDate: "2024-03-10",
  completionDate: "2024-03-15",
  lastModified: "2024-03-20",
  keywords: ["AI", "Machine Learning", "Education", "LMS", "Personalization", "Analytics"],
  course: "CS-401 Senior Capstone",
  year: "2024",
  semester: "Spring",
  externalLinks: [
    "https://github.com/project/ai-lms",
    "https://demo.ai-lms.edu",
    "https://docs.ai-lms.edu"
  ],
  files: [
    { name: "Final_Report.pdf", size: "2.3 MB", type: "PDF" },
    { name: "Source_Code.zip", size: "15.7 MB", type: "ZIP" },
    { name: "Presentation.pptx", size: "8.1 MB", type: "PowerPoint" },
    { name: "Demo_Video.mp4", size: "45.2 MB", type: "Video" }
  ],
  feedback: {
    lecturer: "Excellent work! The AI integration is innovative and well-implemented. Consider expanding the analytics dashboard for future iterations.",
    coordinator: "Outstanding project with high potential for real-world application. Approved for archive with high impact score.",
    status: "approved",
    impactScore: "High"
  }
};

export const ProjectDetailView = ({ projectId, user, onBack }: ProjectDetailViewProps) => {
  const { toast } = useToast();
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const project = mockProject; // In real app, fetch by projectId

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
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReviewAction = (action: string) => {
    if (!reviewFeedback.trim() && action !== "approve") {
      toast({
        title: "Error",
        description: "Please provide feedback before submitting your review",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Review Submitted",
      description: `Project has been ${action}d successfully`,
    });

    setReviewFeedback("");
    setSelectedAction(null);
  };

  const canReviewProject = () => {
    return (user.role === "lecturer" && project.status === "Submitted") ||
           (user.role === "coordinator" && project.status === "Under Review");
  };

  const isOwnProject = () => {
    return user.role === "student" && project.students.includes(user.name);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-600 mt-1">Project Details</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
          <Badge className={getImpactColor(project.impact)}>
            <Award className="w-3 h-3 mr-1" />
            {project.impact} Impact
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Information */}
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              </div>

              {/* Keywords */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {project.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* External Links */}
              {project.externalLinks.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">External Links</h4>
                  <div className="space-y-2">
                    {project.externalLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Files and Attachments */}
          <Card>
            <CardHeader>
              <CardTitle>Files & Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.size} • {file.type}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Section */}
          {canReviewProject() && (
            <Card>
              <CardHeader>
                <CardTitle>Review Project</CardTitle>
                <CardDescription>
                  Provide feedback and approve or request revisions for this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback
                  </label>
                  <Textarea
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    placeholder="Provide detailed feedback for the student..."
                    rows={4}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleReviewAction("approve")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReviewAction("request_revision")}
                    variant="outline"
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Request Revisions
                  </Button>
                  <Button
                    onClick={() => handleReviewAction("reject")}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feedback Section */}
          {project.feedback && (project.feedback.lecturer || project.feedback.coordinator) && (
            <Card>
              <CardHeader>
                <CardTitle>Feedback & Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.feedback.lecturer && (
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Advisor Feedback</h4>
                    <p className="text-gray-700 mt-1">{project.feedback.lecturer}</p>
                  </div>
                )}
                {project.feedback.coordinator && (
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Coordinator Review</h4>
                    <p className="text-gray-700 mt-1">{project.feedback.coordinator}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{project.type}</Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">Completed</p>
                    <p className="text-gray-600">{new Date(project.completionDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">Submitted</p>
                    <p className="text-gray-600">{new Date(project.submissionDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="font-medium">Course</p>
                  <p className="text-gray-600">{project.course}</p>
                </div>

                <div className="text-sm">
                  <p className="font-medium">Academic Year</p>
                  <p className="text-gray-600">{project.semester} {project.year}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team & Advisors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Students</h4>
                <div className="space-y-2">
                  {project.students.map((student, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{student}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Advisor</h4>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{project.advisor}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
