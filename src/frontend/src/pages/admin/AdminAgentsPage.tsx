import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useGetAllAgents, useCreateAgent, useUpdateAgent, useDeleteAgent } from '../../hooks/admin/useAgents';
import { useI18n } from '../../i18n/I18nProvider';
import LoadingState from '../../components/system/LoadingState';
import ErrorState from '../../components/system/ErrorState';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Agent, AgentInput } from '../../backend';

export default function AdminAgentsPage() {
  const { t } = useI18n();
  const { data: agents, isLoading, error, refetch } = useGetAllAgents();
  const createAgent = useCreateAgent();
  const updateAgent = useUpdateAgent();
  const deleteAgent = useDeleteAgent();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const [formData, setFormData] = useState<AgentInput>({
    username: '',
    mobileNumber: '',
    password: '',
    agentRole: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      username: '',
      mobileNumber: '',
      password: '',
      agentRole: '',
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = t('admin.agentUsernameRequired');
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = t('admin.agentMobileRequired');
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = t('admin.agentMobileInvalid');
    }
    if (!formData.password.trim()) {
      newErrors.password = t('admin.agentPasswordRequired');
    }
    if (!formData.agentRole.trim()) {
      newErrors.agentRole = t('admin.agentRoleRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await createAgent.mutateAsync(formData);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleEdit = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormData({
      username: agent.username,
      mobileNumber: agent.mobileNumber,
      password: agent.password,
      agentRole: agent.agentRole,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!validateForm() || !selectedAgent) return;

    try {
      await updateAgent.mutateAsync({
        mobileNumber: selectedAgent.mobileNumber,
        agentInput: formData,
      });
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedAgent(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDeleteConfirm = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAgent) return;

    try {
      await deleteAgent.mutateAsync(selectedAgent.mobileNumber);
      setIsDeleteDialogOpen(false);
      setSelectedAgent(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <ErrorState message={t('admin.agentsError')} onRetry={() => refetch()} />
      </div>
    );
  }

  const agentsList: Agent[] = agents || [];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.agents')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.agentsDesc')}</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.agentCreate')}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.agentUsername')}</TableHead>
                <TableHead>{t('admin.agentMobile')}</TableHead>
                <TableHead>{t('admin.agentRole')}</TableHead>
                <TableHead className="text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentsList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    {t('admin.noAgents')}
                  </TableCell>
                </TableRow>
              ) : (
                agentsList.map((agent) => (
                  <TableRow key={agent.mobileNumber}>
                    <TableCell className="font-medium">{agent.username}</TableCell>
                    <TableCell>{agent.mobileNumber}</TableCell>
                    <TableCell>{agent.agentRole}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(agent)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteConfirm(agent)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.agentCreate')}</DialogTitle>
            <DialogDescription>{t('admin.agentCreateDesc')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-username">{t('admin.agentUsername')}</Label>
              <Input
                id="create-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && <p className="text-sm text-destructive mt-1">{errors.username}</p>}
            </div>
            <div>
              <Label htmlFor="create-mobile">{t('admin.agentMobile')}</Label>
              <Input
                id="create-mobile"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className={errors.mobileNumber ? 'border-destructive' : ''}
              />
              {errors.mobileNumber && <p className="text-sm text-destructive mt-1">{errors.mobileNumber}</p>}
            </div>
            <div>
              <Label htmlFor="create-password">{t('admin.agentPassword')}</Label>
              <Input
                id="create-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
            </div>
            <div>
              <Label htmlFor="create-role">{t('admin.agentRole')}</Label>
              <Input
                id="create-role"
                value={formData.agentRole}
                onChange={(e) => setFormData({ ...formData, agentRole: e.target.value })}
                className={errors.agentRole ? 'border-destructive' : ''}
              />
              {errors.agentRole && <p className="text-sm text-destructive mt-1">{errors.agentRole}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetForm(); }}>
              {t('admin.cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={createAgent.isPending}>
              {createAgent.isPending ? t('admin.creating') : t('admin.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.agentEdit')}</DialogTitle>
            <DialogDescription>{t('admin.agentEditDesc')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-username">{t('admin.agentUsername')}</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && <p className="text-sm text-destructive mt-1">{errors.username}</p>}
            </div>
            <div>
              <Label htmlFor="edit-mobile">{t('admin.agentMobile')}</Label>
              <Input
                id="edit-mobile"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className={errors.mobileNumber ? 'border-destructive' : ''}
              />
              {errors.mobileNumber && <p className="text-sm text-destructive mt-1">{errors.mobileNumber}</p>}
            </div>
            <div>
              <Label htmlFor="edit-password">{t('admin.agentPassword')}</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
            </div>
            <div>
              <Label htmlFor="edit-role">{t('admin.agentRole')}</Label>
              <Input
                id="edit-role"
                value={formData.agentRole}
                onChange={(e) => setFormData({ ...formData, agentRole: e.target.value })}
                className={errors.agentRole ? 'border-destructive' : ''}
              />
              {errors.agentRole && <p className="text-sm text-destructive mt-1">{errors.agentRole}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); setSelectedAgent(null); }}>
              {t('admin.cancel')}
            </Button>
            <Button onClick={handleUpdate} disabled={updateAgent.isPending}>
              {updateAgent.isPending ? t('admin.updating') : t('admin.update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.agentDeleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.agentDeleteConfirmDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAgent(null)}>
              {t('admin.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteAgent.isPending ? t('admin.deleting') : t('admin.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
