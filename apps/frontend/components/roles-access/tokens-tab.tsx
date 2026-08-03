'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button, Input, Table, Modal } from '@repo/shared-ui';
import {
  createToken,
  listRoles,
  listTokens,
  revokeToken,
} from '@/lib/api/access';

export function TokensTab() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenRoleId, setNewTokenRoleId] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ['access', 'tokens'],
    queryFn: listTokens,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['access', 'roles'],
    queryFn: listRoles,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createToken({ name: newTokenName, roleId: newTokenRoleId, type: 'user' }),
    onSuccess: (data) => {
      setGeneratedToken(data.rawToken || null);
      queryClient.invalidateQueries({ queryKey: ['access', 'tokens'] });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => revokeToken(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access', 'tokens'] });
    },
  });

  const handleCopy = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closeDialog = () => {
    setIsCreateOpen(false);
    setGeneratedToken(null);
    setNewTokenName('');
    setNewTokenRoleId('');
  };

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-8">Loading...</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)}>Generate Token</Button>
        <Modal
          isOpen={isCreateOpen}
          onClose={closeDialog}
          title="Generate API Token"
          showFooter={!generatedToken}
          confirmText={createMutation.isPending ? 'Generating...' : 'Generate'}
          onConfirm={() => {
            if (newTokenName && newTokenRoleId && !createMutation.isPending) {
              createMutation.mutate();
            }
          }}
          onCancel={closeDialog}
        >
          {generatedToken ? (
            <div className="space-y-4 py-4">
              <p className="text-sm font-medium text-green-600">
                Token generated successfully! Please copy it now, as you
                won&apos;t be able to see it again.
              </p>
              <div className="flex gap-2">
                <Input
                  value={generatedToken}
                  disabled
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? (
                    <Check className="size-4 text-green-600" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={closeDialog}>Done</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Token Name</label>
                <Input
                  placeholder="e.g. CI/CD Script"
                  value={newTokenName}
                  onChange={setNewTokenName}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newTokenRoleId}
                  onChange={(e) => setNewTokenRoleId(e.target.value)}
                >
                  <option value="" disabled>
                    Select a role...
                  </option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </Modal>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table
          headings={['Name', 'Role', 'Created At', 'Status', 'Actions']}
          data={tokens.map((token) => [
            token.name,
            roles.find((r) => r.id === token.roleId)?.name || 'Unknown',
            new Date(token.createdAt).toLocaleDateString(),
            token.revokedAt ? (
              <span key="status" className="text-red-500 font-medium">
                Revoked
              </span>
            ) : (
              <span key="status" className="text-green-500 font-medium">
                Active
              </span>
            ),
            <div key="actions" className="flex justify-end">
              {!token.revokedAt && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => revokeMutation.mutate(token.id)}
                  title="Revoke Token"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>,
          ])}
        />
      </div>
    </div>
  );
}
