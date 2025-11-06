import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Edit, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { useState } from 'react';
import { EditProjectModal } from './EditProjectModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { user, deleteProject } = useStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(task => task.status === 'done').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const canManageProject = user?.role === 'Administrator' || user?.role === 'Manager';

  const handleDelete = () => {
    deleteProject(project.id);
    toast.success('Project deleted successfully');
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="hover:shadow-card-hover transition-smooth">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </div>
            {canManageProject && (
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent 
          className="cursor-pointer"
          onClick={() => navigate(`/project/${project.id}`)}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tasks</span>
              <Badge variant="secondary">{totalTasks}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>{completedTasks}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditProjectModal
        project={project}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.name}"? This action cannot be undone and will delete all tasks in this project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
