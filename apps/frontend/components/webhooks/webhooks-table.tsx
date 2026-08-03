'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listWebhooks, createWebhook, deleteWebhook } from '@/lib/api/webhooks';
import { WebhookRecord } from '@repo/shared-types';
import { Button, Checkbox, Input, Table, Modal } from '@repo/shared-ui';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Trash2 } from 'lucide-react';

const AVAILABLE_EVENTS = [
  'content.published',
  'content.updated',
  'content.deleted',
  'media.uploaded',
];

export function WebhooksTable() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<WebhookRecord | null>(
    null,
  );

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: listWebhooks,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; url: string; events: string[] }) =>
      createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setPendingDelete(null);
    },
  });

  const closeDialog = () => {
    setIsCreateOpen(false);
    setName('');
    setUrl('');
    setEvents([]);
  };

  const toggleEvent = (event: string) => {
    setEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  };

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-8">Loading...</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)}>Register Webhook</Button>
        <Modal
          isOpen={isCreateOpen}
          onClose={closeDialog}
          title="Register Webhook"
          confirmText={createMutation.isPending ? 'Registering...' : 'Register'}
          onConfirm={() => {
            if (name && url && events.length > 0 && !createMutation.isPending) {
              createMutation.mutate({ name, url, events });
            }
          }}
          onCancel={closeDialog}
        >
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="e.g. Next.js ISR Rebuild"
                value={name}
                onChange={setName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL</label>
              <Input
                placeholder="https://example.com/api/revalidate"
                value={url}
                onChange={setUrl}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Events</label>
              <div className="space-y-2">
                {AVAILABLE_EVENTS.map((event) => (
                  <label
                    key={event}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={events.includes(event)}
                      onChange={() => toggleEvent(event)}
                    />
                    {event}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      </div>

      <div className="border rounded-md overflow-x-auto">
        {webhooks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No webhooks registered yet.
          </div>
        ) : (
          <Table
            headings={['Name', 'URL', 'Events', 'Status', 'Actions']}
            data={webhooks.map((webhook) => [
              webhook.name,
              <span key="url" className="max-w-xs truncate font-mono text-xs">
                {webhook.url}
              </span>,
              <span key="events" className="text-xs text-muted-foreground">
                {webhook.events.join(', ')}
              </span>,
              webhook.isActive ? (
                <span key="status" className="text-green-500 font-medium">
                  Active
                </span>
              ) : (
                <span
                  key="status"
                  className="text-muted-foreground font-medium"
                >
                  Inactive
                </span>
              ),
              <div key="actions" className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => setPendingDelete(webhook)}
                  title="Delete Webhook"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>,
            ])}
          />
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete webhook?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" will stop receiving events immediately. This can't be undone.`
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
