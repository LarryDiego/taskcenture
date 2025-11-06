import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/store/useStore';
import { useMemo } from 'react';

interface DashboardChartsProps {
  projects: Project[];
}

export const DashboardCharts = ({ projects }: DashboardChartsProps) => {
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);
    const completedTasks = projects.reduce(
      (sum, p) => sum + p.tasks.filter(t => t.status === 'done').length,
      0
    );
    const inProgressTasks = projects.reduce(
      (sum, p) => sum + p.tasks.filter(t => t.status === 'in-progress').length,
      0
    );
    const todoTasks = projects.reduce(
      (sum, p) => sum + p.tasks.filter(t => t.status === 'todo').length,
      0
    );
    const overallCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overallCompletion,
    };
  }, [projects]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalProjects}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalTasks}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Overall Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.overallCompletion}%</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${stats.overallCompletion}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Task Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">To Do</span>
              <span className="font-medium">{stats.todoTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">In Progress</span>
              <span className="font-medium">{stats.inProgressTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Done</span>
              <span className="font-medium">{stats.completedTasks}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
