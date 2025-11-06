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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
    // Don't allow toggling the current user (they will be the owner)
    if (currentUser && userId === currentUser.id) {
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
    createProject(name, description, selectedTeamMembers);
    toast.success(t('project.createdSuccess'));
    setName('');
    setDescription('');
    setSelectedTeamMembers([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('project.createNew')}</DialogTitle>
          <DialogDescription>
            {t('project.addToOrganize')}
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
          <div>
            <Label>{t('project.teamMembers')}</Label>
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {isLoadingUsers ? (
                <p className="text-sm text-muted-foreground">{t('project.loadingUsers')}</p>
              ) : availableUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('project.noUsersAvailable')}</p>
              ) : (
                availableUsers.map((user) => {
                  const isCurrentUser = currentUser && user.id === currentUser.id;
                  const isChecked = selectedTeamMembers.includes(user.id) || isCurrentUser;
                  
                  return (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={isChecked}
                        disabled={isCurrentUser}
                        onCheckedChange={() => handleTeamMemberToggle(user.id)}
                      />
                      <label
                        htmlFor={`user-${user.id}`}
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isCurrentUser ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {user.username} ({user.email}) {isCurrentUser && <span className="text-muted-foreground text-xs ml-2">- {t('project.youOwner')}</span>}
                      </label>
                    </div>
                  );
                })
              )}
            </div>
            {selectedTeamMembers.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {selectedTeamMembers.length} {t('project.additionalMembers')}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('dashboard.createProject')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
