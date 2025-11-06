import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Task } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { Calendar, User, MessageSquare, Edit, Trash2, History } from 'lucide-react';
import { toast } from 'sonner';
import { EditTaskModal } from './EditTaskModal';

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-secondary text-secondary-foreground',
  high: 'bg-destructive text-destructive-foreground',
};

const statusColors = {
  todo: 'bg-secondary text-secondary-foreground',
  'in-progress': 'bg-primary text-primary-foreground',
  done: 'bg-success text-success-foreground',
};

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

export const TaskDetailModal = ({ task, open, onClose }: TaskDetailModalProps) => {
  const [comment, setComment] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { addComment, deleteTask } = useStore();

  if (!task) return null;

  const handleAddComment = () => {
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    addComment(task.id, comment);
    setComment('');
    toast.success('Comment added');
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    setIsDeleteDialogOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl mb-2">{task.title}</DialogTitle>
                <DialogDescription>{task.description}</DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
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
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge className={statusColors[task.status]}>
                {statusLabels[task.status]}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Assignee</p>
                  <p className="font-medium">{task.assignee}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="font-medium">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="comments">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <h3 className="font-semibold">Comments ({task.comments.length})</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mb-4 pt-2">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="bg-muted p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                  {task.comments.length === 0 && (
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddComment} className="w-full">
                    Add Comment
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="history">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  <h3 className="font-semibold">History ({task.history.length})</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {task.history.map((entry) => (
                    <div key={entry.id} className="border-l-2 border-primary pl-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{entry.action}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.author}</p>
                      <p className="text-sm mt-1">{entry.changes}</p>
                    </div>
                  ))}
                  {task.history.length === 0 && (
                    <p className="text-sm text-muted-foreground">No history available</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogContent>
      </Dialog>

      {task && (
        <EditTaskModal
          task={task}
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task?.title}"? This action cannot be undone.
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
