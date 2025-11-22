import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Spinner } from '../ui/spinner'
import { SkeletonCard } from '../skeleton-card'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardKpiElementProps {
  isPending:boolean
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  className?: string
}

export function DashboardKpiElement({
  isPending = true,
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  className,
}: DashboardKpiElementProps): React.ReactElement {
  if(isPending) return <SkeletonCard/>
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-4 w-4', iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
