'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'md', ...props }, ref) => {
        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center font-medium leading-none', // added leading-none for perfect alignment
                    'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-all duration-200',
                    'rounded-lg', // changed from rounded-md to rounded-lg for slightly more rounding
                    {
                        // Black and white variants
                        'bg-black text-white hover:bg-gray-800': variant === 'default',
                        'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50': variant === 'outline',
                        'bg-transparent text-gray-900 hover:bg-gray-100': variant === 'ghost',
                    },
                    {
                        // Size values with improved vertical alignment
                        'h-10 px-3 text-sm [&>svg]:h-3.5 [&>svg]:w-3.5': size === 'sm', // 32px height
                        'h-10 px-4 text-base [&>svg]:h-4 [&>svg]:w-4': size === 'md',   // 36px height
                        'h-10 px-5 text-lg [&>svg]:h-5 [&>svg]:w-5': size === 'lg',    // 40px height
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button }