import type * as React from 'react';
import type { Control, FieldValues } from 'react-hook-form';
import type {
  createSchemaSchema,
  ContentEntryRecord,
  SchemaField,
  SchemaRecord,
} from '@repo/shared-types';
import type { z } from 'zod';

export type SchemaBuilderFieldValues = z.input<typeof createSchemaSchema>;

export interface ContentEntryFormProps {
  schema: SchemaRecord;
  /** Omit when creating a new entry. */
  entry?: ContentEntryRecord;
}

export interface VersionHistoryDrawerProps {
  schemaSlug: string;
  entryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEntry: ContentEntryRecord;
}

export interface UsersTabProps {
  isAdmin?: boolean;
}

export interface DynamicFieldProps<T extends FieldValues = FieldValues> {
  field: SchemaField;
  control: Control<T>;
  errors?: { message?: string } | Array<{ message?: string }> | undefined;
}

export interface FieldTypeInputProps {
  field: SchemaField;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  id?: string;
  'aria-describedby'?: React.AriaAttributes['aria-describedby'];
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
}

export interface LexicalRichTextFieldProps {
  /**
   * Serialized Lexical editor state (JSON string).
   * Note: This is an uncontrolled initial value to prevent cursor jumping
   * during fast typing. Form state should be managed via the onChange callback.
   */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  'aria-describedby'?: React.AriaAttributes['aria-describedby'];
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
}

export interface ContentEntryListProps {
  schema: SchemaRecord;
}

export interface FieldListItemProps<T extends FieldValues = FieldValues> {
  id: string;
  index: number;
  control: Control<T>;
  isSelected: boolean;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
  errors?: { message?: string } | Array<{ message?: string }> | undefined;
}

export interface FieldSettingsPanelProps<T extends FieldValues = FieldValues> {
  index: number | null;
  control: Control<T>;
  onRemove: (index: number) => void;
  errors?: { message?: string } | Array<{ message?: string }> | undefined;
}

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm action red — use for danger actions like delete. */
  danger?: boolean;
  onConfirm: () => void;
}
