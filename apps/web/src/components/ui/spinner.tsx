import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

function ContainerSpinner({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <div className="w-full min-h-full justify-center flex items-center">
      <Loader2Icon
        role="status"
        aria-label="Loading"
        className={cn('size-4 animate-spin', className)}
        {...props}
      />
    </div>
  )
}
function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

export { ContainerSpinner, Spinner }
