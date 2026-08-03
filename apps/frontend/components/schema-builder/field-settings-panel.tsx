'use client';

import { schemaFieldDataTypes } from '@repo/shared-types';
import { useWatch, Controller } from 'react-hook-form';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  FormField,
  InputWrapper,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared-ui';

import type {
  FieldSettingsPanelProps,
  SchemaBuilderFieldValues,
} from '@/types/component.types';

// Validation rules matching backend's compileZodSchema:
// min/max apply to text/richtext/number. regex applies only to text/richtext.
const LENGTH_VALIDATED_TYPES = new Set(['text', 'richtext', 'number']);
const REGEX_VALIDATED_TYPES = new Set(['text', 'richtext']);

export function FieldSettingsPanel({
  index,
  control,
  onRemove,
  errors,
}: FieldSettingsPanelProps<SchemaBuilderFieldValues>) {
  // useWatch is called unconditionally with a fallback index of 0 to comply with hooks rules.
  const dataType = useWatch({ control, name: `fields.${index ?? 0}.dataType` });

  if (index === null) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-8 text-center text-sm">
          Select a field to edit its settings.
        </CardContent>
      </Card>
    );
  }

  const showLengthLimits = LENGTH_VALIDATED_TYPES.has(dataType);
  const showRegex = REGEX_VALIDATED_TYPES.has(dataType);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Field settings</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Controller
          control={control}
          name={`fields.${index}.displayName`}
          render={({ field }) => (
            <FormField>
              <label htmlFor={`display-name-${index}`}>Display name</label>
              <InputWrapper>
                <Input
                  id={`display-name-${index}`}
                  placeholder="e.g. Title"
                  {...field}
                />
              </InputWrapper>
              {errors?.displayName?.message && (
                <p className="text-danger text-sm mt-1">
                  {errors.displayName.message as string}
                </p>
              )}
            </FormField>
          )}
        />

        <Controller
          control={control}
          name={`fields.${index}.apiId`}
          render={({ field }) => (
            <FormField>
              <label htmlFor={`api-id-${index}`}>API ID</label>
              <InputWrapper>
                <Input
                  id={`api-id-${index}`}
                  placeholder="e.g. title"
                  {...field}
                />
              </InputWrapper>
              {errors?.apiId?.message && (
                <p className="text-danger text-sm mt-1">
                  {errors.apiId.message as string}
                </p>
              )}
            </FormField>
          )}
        />

        <Controller
          control={control}
          name={`fields.${index}.dataType`}
          render={({ field }) => (
            <FormField>
              <label htmlFor={`data-type-${index}`}>Type</label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={`data-type-${index}`} className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {schemaFieldDataTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.dataType?.message && (
                <p className="text-danger text-sm mt-1">
                  {errors.dataType.message as string}
                </p>
              )}
            </FormField>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <Controller
            control={control}
            name={`fields.${index}.isRequired`}
            render={({ field }) => (
              <FormField className="flex flex-row items-center gap-2 space-y-0">
                <Checkbox
                  id={`required-${index}`}
                  checked={field.value}
                  onChange={field.onChange}
                />
                <label
                  htmlFor={`required-${index}`}
                  className="font-normal !mb-0 cursor-pointer"
                >
                  Required
                </label>
              </FormField>
            )}
          />

          <Controller
            control={control}
            name={`fields.${index}.isUnique`}
            render={({ field }) => (
              <FormField className="flex flex-row items-center gap-2 space-y-0">
                <Checkbox
                  id={`unique-${index}`}
                  checked={field.value}
                  onChange={field.onChange}
                />
                <label
                  htmlFor={`unique-${index}`}
                  className="font-normal !mb-0 cursor-pointer"
                >
                  Unique
                </label>
              </FormField>
            )}
          />

          <Controller
            control={control}
            name={`fields.${index}.isLocalized`}
            render={({ field }) => (
              <FormField className="flex flex-row items-center gap-2 space-y-0">
                <Checkbox
                  id={`localized-${index}`}
                  checked={field.value}
                  onChange={field.onChange}
                />
                <label
                  htmlFor={`localized-${index}`}
                  className="font-normal !mb-0 cursor-pointer"
                >
                  Localized
                </label>
              </FormField>
            )}
          />

          <Controller
            control={control}
            name={`fields.${index}.isRepeatable`}
            render={({ field }) => (
              <FormField className="flex flex-row items-center gap-2 space-y-0">
                <Checkbox
                  id={`repeatable-${index}`}
                  checked={field.value}
                  onChange={field.onChange}
                />
                <label
                  htmlFor={`repeatable-${index}`}
                  className="font-normal !mb-0 cursor-pointer"
                >
                  Repeatable
                </label>
              </FormField>
            )}
          />
        </div>

        {showLengthLimits || showRegex ? (
          <div className="grid gap-3 border-t pt-4">
            <h3 className="text-sm font-medium">Validation</h3>
            <div className="flex flex-wrap gap-3">
              {showLengthLimits ? (
                <>
                  <Controller
                    control={control}
                    name={`fields.${index}.validation.min`}
                    render={({ field }) => (
                      <FormField className="w-24">
                        <label htmlFor={`min-${index}`} className="font-normal">
                          Min
                        </label>
                        <InputWrapper>
                          <Input
                            id={`min-${index}`}
                            type="number"
                            value={(
                              (field.value as number | undefined) ?? ''
                            ).toString()}
                            onChange={(val) =>
                              field.onChange(
                                val === '' ? undefined : Number(val),
                              )
                            }
                          />
                        </InputWrapper>
                        {errors?.validation?.min?.message && (
                          <p className="text-danger text-xs mt-1">
                            {errors.validation.min.message as string}
                          </p>
                        )}
                      </FormField>
                    )}
                  />
                  <Controller
                    control={control}
                    name={`fields.${index}.validation.max`}
                    render={({ field }) => (
                      <FormField className="w-24">
                        <label htmlFor={`max-${index}`} className="font-normal">
                          Max
                        </label>
                        <InputWrapper>
                          <Input
                            id={`max-${index}`}
                            type="number"
                            value={(
                              (field.value as number | undefined) ?? ''
                            ).toString()}
                            onChange={(val) =>
                              field.onChange(
                                val === '' ? undefined : Number(val),
                              )
                            }
                          />
                        </InputWrapper>
                        {errors?.validation?.max?.message && (
                          <p className="text-danger text-xs mt-1">
                            {errors.validation.max.message as string}
                          </p>
                        )}
                      </FormField>
                    )}
                  />
                </>
              ) : null}

              {showRegex ? (
                <Controller
                  control={control}
                  name={`fields.${index}.validation.regex`}
                  render={({ field }) => (
                    <FormField className="flex-1">
                      <label htmlFor={`regex-${index}`} className="font-normal">
                        Regex
                      </label>
                      <InputWrapper>
                        <Input
                          id={`regex-${index}`}
                          placeholder="e.g. ^[a-z0-9-]+$"
                          value={(field.value as string | undefined) ?? ''}
                          onChange={(val) =>
                            field.onChange(val === '' ? undefined : val)
                          }
                        />
                      </InputWrapper>
                      {errors?.validation?.regex?.message && (
                        <p className="text-danger text-xs mt-1">
                          {errors.validation.regex.message as string}
                        </p>
                      )}
                    </FormField>
                  )}
                />
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="flex justify-end border-t pt-4">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onRemove(index)}
          >
            Delete field
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
