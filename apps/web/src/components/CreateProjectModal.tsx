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
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/store/useStore';
import { usersApi } from '@/services/api';
import { toast } from 'sonner';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export const CreateProjectModal = ({ open, onClose }: CreateProjectModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<number[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const createProject = useStore((state) => state.createProject);
  const currentUser = useStore((state) => state.user);

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const users = await usersApi.getAll();
      // Filter out the current user from the list
      setAvailableUsers(users.filter(u => u.id !== currentUser?.id));
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleTeamMemberToggle = (userId: number) => {
    setSelectedTeamMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    createProject(name, description, selectedTeamMembers);
    toast.success('Project created successfully');
    setName('');
    setDescription('');
    setSelectedTeamMembers([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to organize your tasks
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
          <div>
            <Label>Team Members</Label>
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {isLoadingUsers ? (
                <p className="text-sm text-muted-foreground">Loading users...</p>
              ) : availableUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No other users available</p>
              ) : (
                availableUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedTeamMembers.includes(user.id)}
                      onCheckedChange={() => handleTeamMemberToggle(user.id)}
                    />
                    <label
                      htmlFor={`user-${user.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {user.username} ({user.email})
                    </label>
                  </div>
                ))
              )}
            </div>
            {selectedTeamMembers.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {selectedTeamMembers.length} member(s) selected
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
