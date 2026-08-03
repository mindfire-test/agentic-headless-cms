'use client';

import { useQuery } from '@tanstack/react-query';
import { listSchemas } from '@/lib/api/schemas';
import { Card, CardContent, Table } from '@repo/shared-ui';

export function SchemaList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['schemas'],
    queryFn: listSchemas,
  });

  if (isLoading) {
    return (
      <p className="text-muted-foreground text-sm">Loading content types…</p>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="text-danger text-sm">
        Failed to load content types.
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-8 text-center text-sm">
          No content types yet. Create one to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Table
        headings={['Name', 'API ID', 'Kind', 'Fields', 'Localized']}
        data={data.map((schema) => {
          const isLocalized = schema.definition.fields.some(
            (field) => field.isLocalized,
          );
          return [
            <span key="name" className="font-medium">
              {schema.name}
            </span>,
            <span key="slug" className="text-muted-foreground">
              {schema.slug}
            </span>,
            <span key="type" className="text-muted-foreground">
              {schema.type}
            </span>,
            <span key="fields" className="text-muted-foreground">
              {schema.definition.fields.length}
            </span>,
            <span key="loc" className="text-muted-foreground">
              {isLocalized ? 'Yes' : 'No'}
            </span>,
          ];
        })}
      />
    </Card>
  );
}
