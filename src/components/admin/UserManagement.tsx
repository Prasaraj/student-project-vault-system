
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "coordinator" | "dean";
}

interface UserManagementProps {
  user: User;
}

// Mock user data
const mockUsers = [
  { id: "1", name: "John Student", email: "john@university.edu", role: "student", status: "Active" },
  { id: "2", name: "Jane Doe", email: "jane@university.edu", role: "student", status: "Active" },
  { id: "3", name: "Dr. Sarah Lecturer", email: "sarah@university.edu", role: "lecturer", status: "Active" },
  { id: "4", name: "Prof. Mike Coordinator", email: "mike@university.edu", role: "coordinator", status: "Active" },
  { id: "5", name: "Dr. Lisa Dean", email: "lisa@university.edu", role: "dean", status: "Active" },
  { id: "6", name: "Alex Kim", email: "alex@university.edu", role: "student", status: "Inactive" },
];

export const UserManagement = ({ user }: UserManagementProps) => {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
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
                    <Badge className={getStatusColor(u.status)}>
                      {u.status}
                    </Badge>
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
