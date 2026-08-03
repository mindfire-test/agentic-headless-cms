'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  Button,
  Input,
  Modal,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
} from '@repo/shared-ui';
import { inviteUser, listRoles, listUsers } from '@/lib/api/access';
import { UsersTabProps } from '@/types/component.types';

export function UsersTab({ isAdmin = false }: UsersTabProps) {
  const queryClient = useQueryClient();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [devInviteUrl, setDevInviteUrl] = useState<string | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['access', 'users'],
    queryFn: listUsers,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['access', 'roles'],
    queryFn: listRoles,
  });

  const inviteMutation = useMutation({
    mutationFn: inviteUser,
    onSuccess: (data) => {
      toast.success('Invitation sent');
      queryClient.invalidateQueries({ queryKey: ['access', 'users'] });
      setIsInviteOpen(false);
      setEmail('');
      setFirstName('');
      setLastName('');
      setRoleId('');
      if (data.inviteUrl) {
        setDevInviteUrl(data.inviteUrl);
      }
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error ? error.message : 'Failed to invite user';
      toast.error(msg);
    },
  });

  const handleInvite = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !roleId) {
      toast.error('Email and Role are required');
      return;
    }
    inviteMutation.mutate({ email, firstName, lastName, roleId });
  };

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-8">Loading...</div>
    );
  }

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="flex justify-end">
          <Button onClick={() => setIsInviteOpen(true)}>+ Invite User</Button>
          <Modal
            isOpen={isInviteOpen}
            onClose={() => setIsInviteOpen(false)}
            title="Invite User"
            confirmText={
              inviteMutation.isPending ? 'Sending...' : 'Send Invite'
            }
            onConfirm={() => handleInvite()}
            onCancel={() => setIsInviteOpen(false)}
          >
            <form onSubmit={handleInvite} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="email">Email *</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="user@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName">First Name</label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={setFirstName}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName">Last Name</label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={setLastName}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="role">Role *</label>
                <Select value={roleId} onValueChange={setRoleId}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
          </Modal>

          {/* Dev Mode Notification Modal */}
          <Modal
            isOpen={!!devInviteUrl}
            onClose={() => setDevInviteUrl(null)}
            title="Development Mode: Invite Link"
            confirmText="Close"
            onConfirm={() => setDevInviteUrl(null)}
          >
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Since SMTP is not configured in development, you can use this
                link to accept the invitation:
              </p>
              <Input value={devInviteUrl || ''} />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(devInviteUrl || '');
                    toast.success('Copied to clipboard');
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      )}

      <div className="border rounded-md overflow-x-auto">
        <Table
          headings={['Email', 'Name', 'Status', 'Created At']}
          data={users.map((user) => [
            user.email,
            `${user.firstName} ${user.lastName}`,
            <span key="status" className="capitalize">
              {user.status}
            </span>,
            new Date(user.createdAt).toLocaleDateString(),
          ])}
        />
      </div>
    </div>
  );
}
