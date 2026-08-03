'use client';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type CreateSchemaInput,
  createSchemaSchema,
  schemaTypeValues,
} from '@repo/shared-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  InputWrapper,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared-ui';
import { createSchema } from '@/lib/api/schemas';
import { ApiError } from '@/lib/api-client';
import type { SchemaBuilderFieldValues } from '@/types/component.types';
import { FieldListItem } from './field-list-item';
import { FieldSettingsPanel } from './field-settings-panel';

function emptyField() {
  return {
    apiId: '',
    displayName: '',
    dataType: 'text' as const,
    isRequired: false,
    isUnique: false,
    isLocalized: false,
    isRepeatable: false,
    sortOrder: 0,
  };
}

export function SchemaBuilderForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Controls which field's config is expanded in the settings panel.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

  const form = useForm<SchemaBuilderFieldValues, unknown, CreateSchemaInput>({
    resolver: zodResolver(createSchemaSchema),
    defaultValues: {
      name: '',
      slug: '',
      type: 'collection',
      fields: [emptyField()],
    },
  });

  const fieldArray = useFieldArray({ control: form.control, name: 'fields' });
  // useFieldArray's `field.id` serves as a stable drag identity for dnd-kit.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const mutation = useMutation({
    mutationFn: createSchema,
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: ['schemas'] });
      router.push(`/content-types?created=${created.slug}`);
    },
  });

  /**
   * Reorders fields after a drag-and-drop action completes.
   */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fieldArray.fields.findIndex(
      (field) => field.id === active.id,
    );
    const newIndex = fieldArray.fields.findIndex(
      (field) => field.id === over.id,
    );
    if (oldIndex === -1 || newIndex === -1) return;

    fieldArray.move(oldIndex, newIndex);
    if (selectedIndex === oldIndex) setSelectedIndex(newIndex);
  }

  /**
   * Appends a new empty field to the end of the schema.
   */
  function handleAddField() {
    fieldArray.append(emptyField(), { shouldFocus: false });
    setSelectedIndex(fieldArray.fields.length);
  }

  /**
   * Removes a field at the given index and updates the selected field index.
   */
  function handleRemoveField(index: number) {
    fieldArray.remove(index);
    setSelectedIndex((current) => {
      if (current === null) return null;
      if (fieldArray.fields.length <= 1) return null;
      if (index < current) return current - 1;
      if (index === current)
        return Math.min(index, fieldArray.fields.length - 2);
      return current;
    });
  }

  /**
   * Submits the schema form, normalizing field sort orders before API creation.
   */
  async function onSubmit(values: CreateSchemaInput) {
    setSubmitError(null);
    try {
      // sortOrder must be synced with the field list's current visual order.
      const payload: CreateSchemaInput = {
        ...values,
        fields: values.fields.map((field, index) => ({
          ...field,
          sortOrder: index,
        })),
      };
      await mutation.mutateAsync(payload);
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : 'Failed to create schema. Please try again.',
      );
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
        className="grid gap-6"
      >
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormField>
              <label htmlFor="name">Name</label>
              <InputWrapper className="max-w-sm">
                <Input
                  id="name"
                  placeholder="e.g. Blog Post"
                  value={field.value}
                  onChange={field.onChange}
                />
              </InputWrapper>
              {form.formState.errors.name?.message && (
                <p className="text-danger text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </FormField>
          )}
        />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">Fields</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddField}
                >
                  <PlusIcon className="size-4" />
                  Add field
                </Button>
              </div>

              {form.formState.errors.fields?.root?.message ? (
                <p role="alert" className="text-danger text-sm">
                  {form.formState.errors.fields.root.message}
                </p>
              ) : null}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fieldArray.fields.map((field) => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid gap-2">
                    {fieldArray.fields.map((field, index) => (
                      <FieldListItem
                        key={field.id}
                        id={field.id}
                        index={index}
                        control={form.control}
                        isSelected={selectedIndex === index}
                        onSelect={setSelectedIndex}
                        onRemove={handleRemoveField}
                        errors={form.formState.errors?.fields?.[index]}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <Card className="shadow-sm border-muted/30">
              <CardHeader>
                <CardTitle className="text-sm">Type options</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Controller
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormField>
                      <label htmlFor="slug">Slug</label>
                      <InputWrapper>
                        <Input
                          id="slug"
                          placeholder="e.g. blog-post"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </InputWrapper>
                      {form.formState.errors.slug?.message && (
                        <p className="text-danger text-sm mt-1">
                          {form.formState.errors.slug.message}
                        </p>
                      )}
                    </FormField>
                  )}
                />

                <Controller
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormField>
                      <label htmlFor="type">Kind</label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="type" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {schemaTypeValues.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.type?.message && (
                        <p className="text-danger text-sm mt-1">
                          {form.formState.errors.type.message as string}
                        </p>
                      )}
                    </FormField>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <FieldSettingsPanel
            index={selectedIndex}
            control={form.control}
            onRemove={handleRemoveField}
            errors={
              selectedIndex !== null
                ? form.formState.errors?.fields?.[selectedIndex]
                : undefined
            }
          />
        </div>

        {submitError ? (
          <p role="alert" className="text-danger text-sm">
            {submitError}
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating…' : 'Create schema'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
