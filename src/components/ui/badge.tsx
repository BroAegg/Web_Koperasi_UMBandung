import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 animate-fade-in-scale shadow-sm',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80 hover:scale-105 hover:shadow-md',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 hover:shadow-md',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:scale-105 hover:shadow-md',
        outline:
          'text-foreground border-border/60 bg-background/50 hover:bg-accent hover:scale-105 hover:border-accent-foreground/30',
        success:
          'border-transparent bg-green-500 text-white hover:bg-green-600 hover:scale-105 hover:shadow-md shadow-green-500/20',
        warning:
          'border-transparent bg-yellow-500 text-white hover:bg-yellow-600 hover:scale-105 hover:shadow-md shadow-yellow-500/20',
        info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 hover:shadow-md shadow-blue-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={`${badgeVariants({ variant })} ${className || ''}`} {...props} />
}

export { Badge, badgeVariants }
