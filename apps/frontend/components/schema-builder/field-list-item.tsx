'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { useWatch } from 'react-hook-form';

import { Badge, Button } from '@repo/shared-ui';
import { cn } from '@/lib/utils';

import type {
  FieldListItemProps,
  SchemaBuilderFieldValues,
} from '@/types/component.types';

/**
 * Compact single-line summary row for the field list (wireframe S-07) —
 * "Title  text  *required" style, with badges for the field's flags rather
 * than the full config inline. Clicking anywhere but the drag handle or
 * delete button opens this field in the FieldSettingsPanel alongside it.
 */
export function FieldListItem({
  id,
  index,
  control,
  isSelected,
  onSelect,
  onRemove,
  errors,
}: FieldListItemProps<SchemaBuilderFieldValues>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const displayName = useWatch({
    control,
    name: `fields.${index}.displayName`,
  });
  const dataType = useWatch({ control, name: `fields.${index}.dataType` });
  const isRequired = useWatch({ control, name: `fields.${index}.isRequired` });
  const isUnique = useWatch({ control, name: `fields.${index}.isUnique` });
  const isLocalized = useWatch({
    control,
    name: `fields.${index}.isLocalized`,
  });
  const isRepeatable = useWatch({
    control,
    name: `fields.${index}.isRepeatable`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-slot="field-list-item"
      data-dragging={isDragging || undefined}
      className={cn(
        'flex items-center gap-2 rounded-md border px-3 py-2 text-sm',
        isSelected ? 'border-primary bg-accent' : 'bg-card',
        errors && 'border-danger bg-danger/10',
      )}
    >
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none active:cursor-grabbing"
        aria-label={`Reorder field ${index + 1}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => onSelect(index)}
        className="flex flex-1 items-center gap-2 truncate text-left"
      >
        <span className="font-medium">
          {displayName || `Field ${index + 1}`}
        </span>
        <span className="text-muted-foreground">{dataType}</span>
        {isRequired ? <Badge type="secondary" text="*required" /> : null}
        {isUnique ? <Badge type="secondary" text="unique" /> : null}
        {isLocalized ? <Badge type="secondary" text="localized" /> : null}
        {isRepeatable ? <Badge type="secondary" text="repeatable" /> : null}
      </button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        aria-label={`Remove field ${index + 1}`}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
