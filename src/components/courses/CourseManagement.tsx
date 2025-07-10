import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Users, Calendar } from "lucide-react";
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
  description: string;
  semester: "Fall" | "Spring" | "Summer";
  year: string;
  credits: number;
  instructor: string;
  enrollmentCount: number;
  createdAt: string;
}

interface CourseManagementProps {
  user: User;
}

const courseSchema = z.object({
  courseCode: z.string().min(1, "Course code is required"),
  title: z.string().min(1, "Course title is required"),
  description: z.string().optional(),
  semester: z.enum(["Fall", "Spring", "Summer"]),
  year: z.string().min(4, "Year must be at least 4 digits"),
  credits: z.string().min(1, "Credits are required"),
  instructor: z.string().min(1, "Instructor is required"),
});

type CourseFormData = z.infer<typeof courseSchema>;

export const CourseManagement = ({ user }: CourseManagementProps) => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      courseCode: "CS401",
      title: "Software Engineering Capstone",
      description: "Final year capstone project course",
      semester: "Fall",
      year: "2024",
      credits: 6,
      instructor: "Dr. Smith",
      enrollmentCount: 25,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      courseCode: "CS402",
      title: "Advanced Database Systems",
      description: "Advanced concepts in database design and implementation",
      semester: "Spring",
      year: "2024",
      credits: 3,
      instructor: "Dr. Johnson",
      enrollmentCount: 18,
      createdAt: "2024-01-20",
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseCode: "",
      title: "",
      description: "",
      semester: "Fall",
      year: new Date().getFullYear().toString(),
      credits: "",
      instructor: "",
    },
  });

  const onSubmit = (data: CourseFormData) => {
    const newCourse: Course = {
      id: editingCourse ? editingCourse.id : Date.now().toString(),
      courseCode: data.courseCode,
      title: data.title,
      description: data.description || "",
      semester: data.semester,
      year: data.year,
      credits: parseInt(data.credits),
      instructor: data.instructor,
      enrollmentCount: editingCourse ? editingCourse.enrollmentCount : 0,
      createdAt: editingCourse ? editingCourse.createdAt : new Date().toISOString().split('T')[0],
    };

    if (editingCourse) {
      setCourses(courses.map(course => course.id === editingCourse.id ? newCourse : course));
      toast({
        title: "Course Updated",
        description: "Course has been successfully updated.",
      });
    } else {
      setCourses([...courses, newCourse]);
      toast({
        title: "Course Created",
        description: "New course has been successfully created.",
      });
    }

    setIsCreateDialogOpen(false);
    setEditingCourse(null);
    form.reset();
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    form.reset({
      courseCode: course.courseCode,
      title: course.title,
      description: course.description,
      semester: course.semester,
      year: course.year,
      credits: course.credits.toString(),
      instructor: course.instructor,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId));
    toast({
      title: "Course Deleted",
      description: "Course has been successfully deleted.",
      variant: "destructive",
    });
  };

  const getSemesterBadgeColor = (semester: string) => {
    switch (semester) {
      case "Fall": return "bg-orange-100 text-orange-800";
      case "Spring": return "bg-green-100 text-green-800";
      case "Summer": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Manage courses for each academic semester and year</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingCourse(null);
                form.reset();
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCourse ? "Edit Course" : "Create New Course"}</DialogTitle>
              <DialogDescription>
                {editingCourse ? "Update course information" : "Add a new course for the academic semester"}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="courseCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CS401" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineering Capstone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Course description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Fall">Fall</SelectItem>
                            <SelectItem value="Spring">Spring</SelectItem>
                            <SelectItem value="Summer">Summer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credits</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructor</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setEditingCourse(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCourse ? "Update Course" : "Create Course"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="fall">Fall</TabsTrigger>
          <TabsTrigger value="spring">Spring</TabsTrigger>
          <TabsTrigger value="summer">Summer</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                All Courses
              </CardTitle>
              <CardDescription>
                Complete list of courses across all semesters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.courseCode}</TableCell>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>
                        <Badge className={getSemesterBadgeColor(course.semester)}>
                          {course.semester}
                        </Badge>
                      </TableCell>
                      <TableCell>{course.year}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          {course.enrollmentCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(course)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(course.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {["fall", "spring", "summer"].map((semester) => (
          <TabsContent key={semester} value={semester} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{semester} Courses</CardTitle>
                <CardDescription>
                  Courses for {semester} semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Enrollment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses
                      .filter(course => course.semester.toLowerCase() === semester)
                      .map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.courseCode}</TableCell>
                          <TableCell>{course.title}</TableCell>
                          <TableCell>{course.year}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                          <TableCell>{course.instructor}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-500" />
                              {course.enrollmentCount}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(course)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(course.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};