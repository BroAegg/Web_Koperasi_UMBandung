import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'border-input placeholder:text-muted-foreground/60 focus-visible:ring-ring bg-background/50 focus-visible:border-primary hover:border-input/80 flex min-h-[80px] w-full resize-none rounded-lg border px-4 py-3 text-base shadow-sm transition-all duration-200 focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
