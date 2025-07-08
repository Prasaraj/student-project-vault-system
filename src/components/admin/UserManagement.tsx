
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, User, Upload, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "coordinator" | "dean";
  studentId?: string;
  semester?: number;
  graduated?: boolean;
}

interface UserManagementProps {
  user: User;
}

// Mock user data
const mockUsers = [
  { 
    id: "1", 
    name: "John Student", 
    email: "john@university.edu", 
    role: "student", 
    status: "Active",
    studentId: "6831503001",
    semester: 2,
    graduated: false
  },
  { 
    id: "2", 
    name: "Jane Doe", 
    email: "jane@university.edu", 
    role: "student", 
    status: "Active",
    studentId: "6831503002",
    semester: 1,
    graduated: false
  },
  { 
    id: "3", 
    name: "Dr. Sarah Lecturer", 
    email: "sarah@university.edu", 
    role: "lecturer", 
    status: "Active"
  },
  { 
    id: "4", 
    name: "Prof. Mike Coordinator", 
    email: "mike@university.edu", 
    role: "coordinator", 
    status: "Active"
  },
  { 
    id: "5", 
    name: "Dr. Lisa Dean", 
    email: "lisa@university.edu", 
    role: "dean", 
    status: "Active"
  },
  { 
    id: "6", 
    name: "Alex Kim", 
    email: "alex@university.edu", 
    role: "student", 
    status: "Inactive",
    studentId: "6831503003",
    semester: 2,
    graduated: true
  },
];

export const UserManagement = ({ user }: UserManagementProps) => {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isCsvUploadOpen, setIsCsvUploadOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: ""
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "dean":
        return "bg-purple-100 text-purple-800";
      case "coordinator":
        return "bg-blue-100 text-blue-800";
      case "lecturer":
        return "bg-green-100 text-green-800";
      case "student":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const userToAdd = {
      id: (users.length + 1).toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      status: "Active"
    };

    setUsers([...users, userToAdd]);
    setNewUser({ name: "", email: "", role: "", password: "" });
    setIsAddUserOpen(false);
    
    toast({
      title: "Success",
      description: "User added successfully",
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "Success",
      description: "User deleted successfully",
    });
  };

  const handleEditUser = (userToEdit: any) => {
    setEditingUser(userToEdit);
    setNewUser({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
      password: ""
    });
  };

  const handleUpdateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map(u => 
      u.id === editingUser.id 
        ? { ...u, name: newUser.name, email: newUser.email, role: newUser.role as any }
        : u
    ));
    
    setEditingUser(null);
    setNewUser({ name: "", email: "", role: "", password: "" });
    
    toast({
      title: "Success",
      description: "User updated successfully",
    });
  };

  const validateStudentId = (studentId: string): boolean => {
    // Student ID should start with 6831503 and be followed by 3 digits
    const pattern = /^6831503\d{3}$/;
    return pattern.test(studentId);
  };

  const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid CSV file",
        variant: "destructive",
      });
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file first",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        toast({
          title: "Error",
          description: "CSV file must contain headers and at least one data row",
          variant: "destructive",
        });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['student_id', 'name', 'email'];
      
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        toast({
          title: "Error",
          description: `Missing required columns: ${missingHeaders.join(', ')}`,
          variant: "destructive",
        });
        return;
      }

      const studentIdIndex = headers.indexOf('student_id');
      const nameIndex = headers.indexOf('name');
      const emailIndex = headers.indexOf('email');

      const newStudents = [];
      const errors = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const studentId = values[studentIdIndex];
        const name = values[nameIndex];
        const email = values[emailIndex];

        if (!studentId || !name || !email) {
          errors.push(`Row ${i + 1}: Missing required data`);
          continue;
        }

        if (!validateStudentId(studentId)) {
          errors.push(`Row ${i + 1}: Invalid student ID format (should be 6831503xxx)`);
          continue;
        }

        // Check if email already exists
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
          errors.push(`Row ${i + 1}: Email ${email} already exists`);
          continue;
        }

        newStudents.push({
          id: studentId,
          name: name,
          email: email,
          role: "student" as const,
          status: "Active"
        });
      }

      if (errors.length > 0) {
        toast({
          title: "Import Errors",
          description: `${errors.length} errors found. Check console for details.`,
          variant: "destructive",
        });
        console.error("CSV Import Errors:", errors);
      }

      if (newStudents.length > 0) {
        setUsers([...users, ...newStudents]);
        toast({
          title: "Success",
          description: `Successfully imported ${newStudents.length} students`,
        });
      }

      setCsvFile(null);
      setIsCsvUploadOpen(false);
      
      // Reset file input
      const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process CSV file",
        variant: "destructive",
      });
      console.error("CSV processing error:", error);
    }
  };

  const generateSampleCsv = () => {
    const sampleData = `student_id,name,email
6831503001,John Smith,john.smith@university.edu
6831503002,Jane Doe,jane.doe@university.edu
6831503003,Bob Johnson,bob.johnson@university.edu`;
    
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (user.role !== "coordinator") {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">Access Denied</div>
        <p className="text-gray-500 mt-2">
          Only Program Coordinators can access user management
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={generateSampleCsv}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
          <Button variant="outline" onClick={() => setIsCsvUploadOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import Students
          </Button>
          <Dialog open={isAddUserOpen || !!editingUser} onOpenChange={(open) => {
            if (!open) {
              setIsAddUserOpen(false);
              setEditingUser(null);
              setNewUser({ name: "", email: "", role: "", password: "" });
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddUserOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="lecturer">Lecturer</SelectItem>
                      <SelectItem value="coordinator">Program Coordinator</SelectItem>
                      <SelectItem value="dean">Dean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {!editingUser && (
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter initial password"
                    />
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAddUserOpen(false);
                      setEditingUser(null);
                      setNewUser({ name: "", email: "", role: "", password: "" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={editingUser ? handleUpdateUser : handleAddUser}>
                    {editingUser ? "Update User" : "Add User"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* CSV Upload Dialog */}
      <Dialog open={isCsvUploadOpen} onOpenChange={setIsCsvUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Students from CSV</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">Upload a CSV file with the following format:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Headers: student_id, name, email</li>
                <li>Student ID format: 6831503xxx (where xxx are 3 digits)</li>
                <li>Example: 6831503001, John Smith, john.smith@university.edu</li>
              </ul>
            </div>
            
            <div>
              <Label htmlFor="csv-file-input">Select CSV File</Label>
              <Input
                id="csv-file-input"
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="mt-1"
              />
            </div>
            
            {csvFile && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <FileText className="w-4 h-4" />
                <span>Selected: {csvFile.name}</span>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCsvUploadOpen(false);
                  setCsvFile(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCsvUpload} disabled={!csvFile}>
                Import Students
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Users</CardTitle>
            <div className="text-sm text-gray-500">
              {filteredUsers.length} user(s) found
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="lecturer">Lecturers</SelectItem>
                <SelectItem value="coordinator">Coordinators</SelectItem>
                <SelectItem value="dean">Deans</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(u.role)}>
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {u.studentId || "-"}
                  </TableCell>
                  <TableCell>
                    {u.semester || "-"}
                  </TableCell>
                  <TableCell>
                    {u.graduated ? (
                      <Badge variant="outline" className="bg-gray-100 text-gray-600">
                        Graduated (View Only)
                      </Badge>
                    ) : u.role === "student" ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    ) : (
                      <Badge className={getStatusColor(u.status)}>
                        {u.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(u)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg">No users found</div>
              <p className="text-gray-500 mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
