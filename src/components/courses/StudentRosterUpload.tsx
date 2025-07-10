import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Download, Users, AlertCircle, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "coordinator" | "dean";
}

interface Course {
  id: string;
  courseCode: string;
  title: string;
  semester: "Fall" | "Spring" | "Summer";
  year: string;
}

interface StudentRecord {
  id: string;
  studentId: string;
  name: string;
  email: string;
  year: string;
  status: "active" | "enrolled" | "error";
  errorMessage?: string;
}

interface StudentRosterUploadProps {
  user: User;
}

export const StudentRosterUpload = ({ user }: StudentRosterUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [uploadedStudents, setUploadedStudents] = useState<StudentRecord[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    total: number;
    successful: number;
    failed: number;
  } | null>(null);

  // Mock courses data
  const courses: Course[] = [
    {
      id: "1",
      courseCode: "CS401",
      title: "Software Engineering Capstone",
      semester: "Fall",
      year: "2024",
    },
    {
      id: "2",
      courseCode: "CS402",
      title: "Advanced Database Systems",
      semester: "Spring",
      year: "2024",
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!selectedCourse) {
      toast({
        title: "Course Required",
        description: "Please select a course before uploading the roster.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error("File must contain at least a header row and one data row");
        }

        // Parse CSV (assuming format: Student ID, Name, Email, Year)
        const students: StudentRecord[] = [];
        const headers = lines[0].split(',').map(h => h.trim());
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          
          if (values.length >= 3) {
            const student: StudentRecord = {
              id: Date.now().toString() + i,
              studentId: values[0] || `STU${Date.now()}${i}`,
              name: values[1] || "Unknown Student",
              email: values[2] || "",
              year: values[3] || "2024",
              status: "active",
            };

            // Basic validation
            if (!student.email.includes('@')) {
              student.status = "error";
              student.errorMessage = "Invalid email format";
            }

            students.push(student);
          }
        }

        setUploadedStudents(students);
        simulateUpload(students);
        
      } catch (error) {
        toast({
          title: "Upload Error",
          description: error instanceof Error ? error.message : "Failed to parse the file",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
  };

  const simulateUpload = (students: StudentRecord[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          const successful = students.filter(s => s.status !== "error").length;
          const failed = students.filter(s => s.status === "error").length;
          
          setUploadResults({
            total: students.length,
            successful,
            failed,
          });

          // Update enrolled students status
          setUploadedStudents(prev => 
            prev.map(student => 
              student.status === "active" 
                ? { ...student, status: "enrolled" as const }
                : student
            )
          );

          toast({
            title: "Upload Complete",
            description: `Successfully enrolled ${successful} students. ${failed} failed.`,
          });
        }
        return newProgress;
      });
    }, 200);
  };

  const downloadTemplate = () => {
    const csvContent = "Student ID,Name,Email,Year\nSTU001,John Doe,john.doe@university.edu,2024\nSTU002,Jane Smith,jane.smith@university.edu,2024";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'student_roster_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const removeStudent = (studentId: string) => {
    setUploadedStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enrolled":
        return <Badge className="bg-green-100 text-green-800">Enrolled</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Roster Upload</h1>
        <p className="text-gray-600 mt-1">Upload student rosters for courses each semester</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Roster
              </CardTitle>
              <CardDescription>
                Select a course and upload the student roster file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="course-select">Select Course</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.courseCode} - {course.title} ({course.semester} {course.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="file-upload">Upload CSV File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  disabled={!selectedCourse}
                />
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <Label>Upload Progress</Label>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
                </div>
              )}

              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {uploadResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Upload Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Students:</span>
                    <span className="font-medium">{uploadResults.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Successfully Enrolled:</span>
                    <span className="font-medium text-green-600">{uploadResults.successful}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed:</span>
                    <span className="font-medium text-red-600">{uploadResults.failed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>CSV Format:</strong> The file should contain columns for Student ID, Name, Email, and Year. 
              Use the template above for the correct format.
            </AlertDescription>
          </Alert>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Uploaded Students
                {uploadedStudents.length > 0 && (
                  <Badge variant="secondary">{uploadedStudents.length}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Review and manage uploaded student data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No students uploaded yet</p>
                  <p className="text-sm">Select a course and upload a CSV file to get started</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.studentId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.year}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(student.status)}
                            {student.errorMessage && (
                              <p className="text-xs text-red-600">{student.errorMessage}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeStudent(student.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};