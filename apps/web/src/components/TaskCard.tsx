import { Task } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-secondary text-secondary-foreground',
  high: 'bg-destructive text-destructive-foreground',
};

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 cursor-pointer hover:shadow-card-hover shadow-card transition-smooth mb-3"
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium flex-1 line-clamp-2">{task.title}</h4>
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>
        
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          {task.assigneeId && task.assigneeId !== 'unassigned' && (
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span>{task.assignee || `User #${task.assigneeId}`}</span>
            </div>
          )}
          {(!task.assigneeId || task.assigneeId === 'unassigned') && (
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span className="text-muted-foreground/60">Unassigned</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
