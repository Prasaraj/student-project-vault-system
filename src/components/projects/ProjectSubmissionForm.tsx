
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "coordinator" | "dean";
}

interface ProjectSubmissionFormProps {
  user: User;
  onBack: () => void;
}

export const ProjectSubmissionForm = ({ user, onBack }: ProjectSubmissionFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    course: "",
    description: "",
    keywords: [],
    groupMembers: [],
    advisors: [],
    files: [],
    externalLinks: [],
    completionDate: "",
    // Dynamic fields based on project type
    competitionName: "",
    award: "",
    publicationVenue: "",
    doi: "",
    beneficiaryOrganization: "",
  });

  const [newKeyword, setNewKeyword] = useState("");
  const [newLink, setNewLink] = useState("");

  const projectTypes = [
    "Capstone",
    "Competition Work",
    "Academic Publication",
    "Social Service",
    "Other"
  ];

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const addExternalLink = () => {
    if (newLink.trim()) {
      setFormData(prev => ({
        ...prev,
        externalLinks: [...prev.externalLinks, newLink.trim()]
      }));
      setNewLink("");
    }
  };

  const removeExternalLink = (link: string) => {
    setFormData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks.filter(l => l !== link)
    }));
  };

  const handleSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: isDraft ? "Project saved as draft" : "Project submitted for review",
    });

    // Reset form and go back
    onBack();
  };

  const renderDynamicFields = () => {
    switch (formData.type) {
      case "Competition Work":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="competitionName">Competition Name</Label>
              <Input
                id="competitionName"
                value={formData.competitionName}
                onChange={(e) => setFormData(prev => ({ ...prev, competitionName: e.target.value }))}
                placeholder="Enter competition name"
              />
            </div>
            <div>
              <Label htmlFor="award">Award/Recognition</Label>
              <Input
                id="award"
                value={formData.award}
                onChange={(e) => setFormData(prev => ({ ...prev, award: e.target.value }))}
                placeholder="e.g., 1st Place, Honorable Mention"
              />
            </div>
          </div>
        );
      case "Academic Publication":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publicationVenue">Publication Venue</Label>
              <Input
                id="publicationVenue"
                value={formData.publicationVenue}
                onChange={(e) => setFormData(prev => ({ ...prev, publicationVenue: e.target.value }))}
                placeholder="Journal or Conference name"
              />
            </div>
            <div>
              <Label htmlFor="doi">DOI/URL</Label>
              <Input
                id="doi"
                value={formData.doi}
                onChange={(e) => setFormData(prev => ({ ...prev, doi: e.target.value }))}
                placeholder="https://doi.org/..."
              />
            </div>
          </div>
        );
      case "Social Service":
        return (
          <div>
            <Label htmlFor="beneficiaryOrganization">Beneficiary Organization/Community</Label>
            <Input
              id="beneficiaryOrganization"
              value={formData.beneficiaryOrganization}
              onChange={(e) => setFormData(prev => ({ ...prev, beneficiaryOrganization: e.target.value }))}
              placeholder="Organization or community served"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-3xl font-bold text-gray-900">Submit New Project</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="type">Project Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="course">Associated Course/Semester</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                  placeholder="e.g., CS-401 Fall 2024"
                />
              </div>

              <div>
                <Label htmlFor="completionDate">Completion Date</Label>
                <Input
                  id="completionDate"
                  type="date"
                  value={formData.completionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Project Description */}
            <div>
              <Label htmlFor="description">Abstract/Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide a detailed description of your project..."
                rows={6}
                required
              />
            </div>

            {/* Keywords */}
            <div>
              <Label>Keywords/Tags</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add keyword"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <Button type="button" onClick={addKeyword} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{keyword}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Dynamic Fields */}
            {formData.type && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                {renderDynamicFields()}
              </div>
            )}

            {/* External Links */}
            <div>
              <Label>External Links</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://github.com/project"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExternalLink())}
                />
                <Button type="button" onClick={addExternalLink} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-1">
                {formData.externalLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      {link}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeExternalLink(link)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <Label>Files & Attachments</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <p className="text-sm text-gray-500">Supports PDF, DOC, PPT, ZIP files up to 50MB each</p>
                <Button type="button" variant="outline" className="mt-4">
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmit(e, true)}
              >
                Save Draft
              </Button>
              <Button type="submit">
                Submit for Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
