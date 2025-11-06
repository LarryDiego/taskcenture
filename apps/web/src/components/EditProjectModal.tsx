import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStore, Project } from '@/store/useStore';
import { toast } from 'sonner';

interface EditProjectModalProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

export const EditProjectModal = ({ project, open, onClose }: EditProjectModalProps) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const updateProject = useStore((state) => state.updateProject);

  useEffect(() => {
    setName(project.name);
    setDescription(project.description);
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    updateProject(project.id, name, description);
    toast.success('Project updated successfully');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update project details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
