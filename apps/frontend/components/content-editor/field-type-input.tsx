'use client';

import type * as React from 'react';
import type { FieldTypeInputProps } from '@/types/component.types';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@repo/shared-ui';

import { LexicalRichTextField } from './lexical-rich-text-field';

/**
 * Renders a specific input control based on the field's dataType.
 *
 * Note: This component is agnostic to react-hook-form. It acts as a standard controlled input.
 * It is wrapped by `FormControl` which automatically handles accessibility attributes
 * (like aria-invalid) by forwarding props via `...rest`.
 */
export function FieldTypeInput({
  field,
  value,
  onChange,
  disabled,
  ...rest
}: FieldTypeInputProps) {
  switch (field.dataType) {
    case 'richtext':
      return (
        <LexicalRichTextField
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          placeholder={field.displayName}
          disabled={disabled}
          {...rest}
        />
      );

    case 'boolean':
      return (
        <Switch
          checked={Boolean(value)}
          onCheckedChange={onChange}
          disabled={disabled}
          {...rest}
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          disabled={disabled}
          value={typeof value === 'number' ? value.toString() : ''}
          onChange={(val) => onChange(val === '' ? undefined : Number(val))}
          {...rest}
        />
      );

    case 'date':
      return (
        <Input
          type="date"
          disabled={disabled}
          value={typeof value === 'string' ? value.slice(0, 10) : ''}
          onChange={(val) => onChange(val ? new Date(val).toISOString() : '')}
          {...rest}
        />
      );

    case 'datetime':
      return (
        <Input
          type="datetime-local"
          disabled={disabled}
          value={typeof value === 'string' ? value.slice(0, 16) : ''}
          onChange={(val) => onChange(val ? new Date(val).toISOString() : '')}
          {...rest}
        />
      );

    case 'json':
      return (
        <Textarea
          disabled={disabled}
          className="font-mono text-xs"
          rows={6}
          value={
            typeof value === 'string'
              ? value
              : JSON.stringify(value ?? {}, null, 2)
          }
          onChange={(val) => onChange(val)}
          {...rest}
        />
      );

    case 'media':
    case 'relation':
      // No media picker / relation search UI exists yet (out of scope for
      // this issue) — the backend only validates these as a UUID string, so
      // a plain text input is the honest minimum viable control.
      return (
        <Input
          placeholder="UUID"
          disabled={disabled}
          value={typeof value === 'string' ? value : ''}
          onChange={(val) => onChange(val)}
          {...rest}
        />
      );

    case 'enum': {
      const options = (field.config as { options?: unknown } | null | undefined)
        ?.options;
      const stringOptions = Array.isArray(options)
        ? options.filter((o): o is string => typeof o === 'string')
        : [];

      if (stringOptions.length === 0) {
        // No options configured on this field — fall back to free text
        // rather than rendering a Select with nothing to pick.
        return (
          <Input
            disabled={disabled}
            value={typeof value === 'string' ? value : ''}
            onChange={(val) => onChange(val)}
            {...rest}
          />
        );
      }

      return (
        <Select
          value={typeof value === 'string' ? value : undefined}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full" {...rest}>
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {stringOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    case 'email':
      return (
        <Input
          type="email"
          disabled={disabled}
          value={typeof value === 'string' ? value : ''}
          onChange={(val) => onChange(val)}
          {...rest}
        />
      );

    case 'url':
      return (
        <Input
          type="url"
          disabled={disabled}
          value={typeof value === 'string' ? value : ''}
          onChange={(val) => onChange(val)}
          {...rest}
        />
      );

    case 'text':
    default:
      return (
        <Input
          disabled={disabled}
          value={typeof value === 'string' ? value : ''}
          onChange={(val) => onChange(val)}
          {...rest}
        />
      );
  }
}
