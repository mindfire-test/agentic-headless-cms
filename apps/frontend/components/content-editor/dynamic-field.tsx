'use client';

import { PlusIcon, Trash2 } from 'lucide-react';
import { type Control, useFieldArray, Controller } from 'react-hook-form';

import { Button, FormField, InputWrapper } from '@repo/shared-ui';
import type { DynamicFieldProps } from '@/types/component.types';
import { FieldTypeInput } from './field-type-input';

export function DynamicField({ field, control, errors }: DynamicFieldProps) {
  if (field.isRepeatable) {
    return (
      <RepeatableDynamicField field={field} control={control} errors={errors} />
    );
  }

  return (
    <Controller
      control={control}
      name={field.apiId}
      render={({ field: rhfField }) => (
        <FormField>
          <label htmlFor={`field-${field.apiId}`}>
            {field.displayName}
            {field.isRequired ? ' *' : ''}
          </label>
          <InputWrapper>
            <FieldTypeInput
              id={`field-${field.apiId}`}
              field={field}
              value={rhfField.value}
              onChange={rhfField.onChange}
            />
          </InputWrapper>
          {errors && !Array.isArray(errors) && errors.message && (
            <p className="text-danger text-sm mt-1">{errors.message}</p>
          )}
        </FormField>
      )}
    />
  );
}

function RepeatableDynamicField({ field, control, errors }: DynamicFieldProps) {
  // The generic Record<string, unknown> prevents useFieldArray from inferring ArrayPath.
  // We cast to Record<string, unknown[]> to bypass this; field.isRepeatable guarantees it at runtime.
  const arrayControl = control as unknown as Control<Record<string, unknown[]>>;
  const fieldArray = useFieldArray({
    control: arrayControl,
    name: field.apiId,
  });

  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">
        {field.displayName}
        {field.isRequired ? ' *' : ''}
      </span>

      <div className="grid gap-2">
        {fieldArray.fields.map((item, index) => (
          <Controller
            key={item.id}
            control={control}
            name={`${field.apiId}.${index}`}
            render={({ field: rhfField }) => (
              <FormField className="flex flex-row items-start gap-2 space-y-0">
                <InputWrapper className="flex-1">
                  <FieldTypeInput
                    id={`field-${field.apiId}-${index}`}
                    field={field}
                    value={rhfField.value}
                    onChange={rhfField.onChange}
                  />
                </InputWrapper>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${field.displayName} item ${index + 1}`}
                  onClick={() => fieldArray.remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </FormField>
            )}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() =>
          fieldArray.append(field.dataType === 'boolean' ? false : '')
        }
      >
        <PlusIcon className="size-4" />
        Add {field.displayName}
      </Button>

      {errors && !Array.isArray(errors) && errors.message && (
        <p className="text-danger text-sm mt-1">{errors.message}</p>
      )}
      {Array.isArray(errors) &&
        errors.some((e: { message?: string }) => e?.message) && (
          <div className="text-danger text-sm mt-1">
            {errors.map((e: { message?: string }, i: number) =>
              e?.message ? (
                <p key={i}>
                  Item {i + 1}: {e.message}
                </p>
              ) : null,
            )}
          </div>
        )}
    </div>
  );
}
