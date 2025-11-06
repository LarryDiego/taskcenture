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
import { useStore, Project } from '@/store/useStore';
import { usersApi } from '@/services/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface EditProjectModalProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export const EditProjectModal = ({ project, open, onClose }: EditProjectModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<number[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const updateProject = useStore((state) => state.updateProject);
  const currentUser = useStore((state) => state.user);

  useEffect(() => {
    setName(project.name);
    setDescription(project.description);
    // Set the initial team members from the project
    if (project.teamMembers) {
      setSelectedTeamMembers(project.teamMembers.map(member => member.id));
    }
  }, [project]);

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const users = await usersApi.getAll();
      // Don't filter out any users - we need to show all of them
      setAvailableUsers(users);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error(t('project.failedToLoad'));
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleTeamMemberToggle = (userId: number) => {
    // Don't allow toggling the owner
    if (project.owner && userId === project.owner.id) {
      return;
    }
    setSelectedTeamMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t('project.pleaseEnterName'));
      return;
    }
    updateProject(project.id, name, description, selectedTeamMembers);
    toast.success(t('project.updatedSuccess'));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('project.edit')}</DialogTitle>
          <DialogDescription>
            {t('project.updateDetails')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{t('project.name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('project.enterName')}
            />
          </div>
          <div>
            <Label htmlFor="description">{t('project.description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('project.enterDescription')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('project.teamMembers')} {selectedTeamMembers.length > 0 && `(${selectedTeamMembers.length} ${t('project.membersSelected')})`}</Label>
            {isLoadingUsers ? (
              <p className="text-sm text-muted-foreground">{t('project.loadingUsers')}</p>
            ) : availableUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('project.noUsersAvailable')}</p>
            ) : (
              <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                {availableUsers.map((user) => {
                  const isOwner = project.owner && user.id === project.owner.id;
                  const isChecked = selectedTeamMembers.includes(user.id) || isOwner;
                  
                  return (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={isChecked}
                        disabled={isOwner}
                        onCheckedChange={() => handleTeamMemberToggle(user.id)}
                      />
                      <label
                        htmlFor={`user-${user.id}`}
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isOwner ? 'cursor-not-allowed' : 'cursor-pointer'} flex-1`}
                      >
                        {user.username} ({user.email}) {isOwner && <span className="text-muted-foreground text-xs ml-2">- {t('project.owner')}</span>}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('project.update')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
