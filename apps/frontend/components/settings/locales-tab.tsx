'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listLocales, createLocale, deleteLocale } from '@/lib/api/locales';
import { Button, Input, Table, Modal } from '@repo/shared-ui';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Trash2 } from 'lucide-react';
import { LocaleRecord } from '@repo/shared-types';

export function LocalesTab() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [pendingDelete, setPendingDelete] = useState<LocaleRecord | null>(null);

  const { data: locales = [], isLoading } = useQuery({
    queryKey: ['locales'],
    queryFn: listLocales,
  });

  const createMutation = useMutation({
    mutationFn: () => createLocale({ code, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locales'] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLocale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locales'] });
      setPendingDelete(null);
    },
  });

  const closeDialog = () => {
    setIsCreateOpen(false);
    setCode('');
    setName('');
  };

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-8">Loading...</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)}>Add Locale</Button>
        <Modal
          isOpen={isCreateOpen}
          onClose={closeDialog}
          title="Add Locale"
          confirmText={createMutation.isPending ? 'Adding...' : 'Add'}
          onConfirm={() => {
            if (code && name && !createMutation.isPending) {
              createMutation.mutate();
            }
          }}
          onCancel={closeDialog}
        >
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Code</label>
              <Input placeholder="e.g. fr-FR" value={code} onChange={setCode} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="e.g. French"
                value={name}
                onChange={setName}
              />
            </div>
          </div>
        </Modal>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table
          headings={['Code', 'Name', 'Default', 'Actions']}
          data={locales.map((locale) => [
            <span key="code" className="font-mono text-xs">
              {locale.code}
            </span>,
            locale.name,
            locale.isDefault ? 'Yes' : '',
            <div key="actions" className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600"
                onClick={() => setPendingDelete(locale)}
                title="Delete Locale"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>,
          ])}
        />
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete locale?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" (${pendingDelete.code}) will be removed. This can't be undone.`
            : undefined
        }
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          if (pendingDelete) deleteMutation.mutate(pendingDelete.id);
        }}
      />
    </div>
  );
}
