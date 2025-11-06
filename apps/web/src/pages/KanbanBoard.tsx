import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { KanbanColumn } from '@/components/KanbanColumn';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { TaskFilters } from '@/components/TaskFilters';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { TaskStatus } from '@/store/useStore';

export const KanbanBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, selectedProject, selectProject, updateTaskStatus, selectTask, selectedTask } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (projectId) {
      selectProject(projectId);
    }
  }, [user, projectId, navigate, selectProject]);

  const assignees = useMemo(() => {
    if (!selectedProject) return [];
    const uniqueAssignees = new Set(selectedProject.tasks.map(task => task.assignee));
    return Array.from(uniqueAssignees).sort();
  }, [selectedProject]);

  const filteredTasks = useMemo(() => {
    if (!selectedProject) return [];
    return selectedProject.tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesAssignee = assigneeFilter === 'all' || task.assignee === assigneeFilter;
      return matchesSearch && matchesStatus && matchesAssignee;
    });
  }, [selectedProject, searchQuery, statusFilter, assigneeFilter]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    updateTaskStatus(taskId, newStatus);
  };

  const handleTaskClick = (taskId: string) => {
    selectTask(taskId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    selectTask(null);
  };

  if (!selectedProject) return null;

  const todoTasks = filteredTasks.filter((task) => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter((task) => task.status === 'in-progress');
  const doneTasks = filteredTasks.filter((task) => task.status === 'done');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{selectedProject.name}</h2>
              <p className="text-muted-foreground">{selectedProject.description}</p>
            </div>
            <Button onClick={() => setIsCreateTaskModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </div>
        </div>

        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          assigneeFilter={assigneeFilter}
          onAssigneeFilterChange={setAssigneeFilter}
          assignees={assignees}
        />

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            <KanbanColumn
              title="To Do"
              status="todo"
              tasks={todoTasks}
              onTaskClick={handleTaskClick}
            />
            <KanbanColumn
              title="In Progress"
              status="in-progress"
              tasks={inProgressTasks}
              onTaskClick={handleTaskClick}
            />
            <KanbanColumn
              title="Done"
              status="done"
              tasks={doneTasks}
              onTaskClick={handleTaskClick}
            />
          </div>
          <DragOverlay />
        </DndContext>

        <TaskDetailModal
          task={selectedTask}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
        
        {projectId && (
          <CreateTaskModal
            open={isCreateTaskModalOpen}
            onClose={() => setIsCreateTaskModalOpen(false)}
            projectId={projectId}
          />
        )}
      </main>
    </div>
  );
};
