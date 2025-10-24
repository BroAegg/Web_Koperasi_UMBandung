import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 animate-fade-in-scale',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80 hover:scale-105',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:scale-105',
        outline: 'text-foreground hover:bg-accent hover:scale-105',
        success: 'border-transparent bg-green-500 text-white hover:bg-green-600 hover:scale-105',
        warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600 hover:scale-105',
        info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600 hover:scale-105',
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
