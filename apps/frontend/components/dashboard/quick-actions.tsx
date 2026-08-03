import Link from 'next/link';
import { Button } from '@repo/shared-ui';

/**
 * "New Entry" has no single target — content creation is always scoped to a
 * schema (/content/[schemaSlug]/new), and there's no default/most-recent
 * schema to assume — so it routes to the content-type picker instead, the
 * closest real "creation screen" without inventing a route that doesn't
 * exist. Content-Type and Media both have one true destination each.
 */
export function QuickActions() {
  return (
    <div className="flex flex-col gap-3">
      <Button asChild className="w-full justify-start h-11">
        <Link href="/content">+ New Entry</Link>
      </Button>
      <Button asChild variant="outline" className="w-full justify-start h-11">
        <Link href="/content-types/new">+ Content-Type</Link>
      </Button>
      <Button asChild variant="outline" className="w-full justify-start h-11">
        <Link href="/media">Upload Media</Link>
      </Button>
    </div>
  );
}
