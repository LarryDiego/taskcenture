import { Task, TaskStatus } from '@/store/useStore';
import { TaskCard } from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

const statusColors = {
  todo: 'border-secondary',
  'in-progress': 'border-primary',
  done: 'border-success',
};

const statusBgColors = {
  todo: 'bg-secondary/10',
  'in-progress': 'bg-primary/10',
  done: 'bg-success/10',
};

export const KanbanColumn = ({ title, status, tasks, onTaskClick }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col min-w-[300px] flex-1">
      <div className={`border-t-4 ${statusColors[status]} rounded-t-lg bg-card p-4 shadow-card`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBgColors[status]}`}>
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 rounded-b-lg border border-t-0 ${
          isOver ? 'bg-muted/50' : 'bg-card'
        } transition-colors`}
        style={{ minHeight: '500px' }}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
