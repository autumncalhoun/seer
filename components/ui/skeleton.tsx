import * as React from 'react'
import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'rounded-md bg-muted bg-size-[200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]',
        className
      )}
      style={{
        backgroundImage:
          'linear-gradient(90deg,var(--muted)_0%,color-mix(in oklch,var(--muted)_70%,var(--muted-foreground))_50%,var(--muted)_100%)',
      }}
      {...props}
    />
  )
}

export { Skeleton }
