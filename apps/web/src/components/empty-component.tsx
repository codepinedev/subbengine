import { BrushCleaning } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty'
import type { ReactNode } from 'react'

export function EmptyComponent({
  children,
  title = 'No data',
  description = 'No data found',
}: {
  children?: ReactNode
  title?: string
  description?: string
}) {
  return (
    <Empty className="border-primary bg-muted/30 border-2 border-dashed shadow-lg">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BrushCleaning />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  )
}
