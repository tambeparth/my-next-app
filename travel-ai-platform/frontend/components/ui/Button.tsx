'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'travel' | 'ocean' | 'sunset'
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'md', ...props }, ref) => {
        return (
            <button
                className={cn(
                    // Base styles
                    'inline-flex items-center justify-center font-medium leading-none',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-all duration-300 ease-in-out',
                    'rounded-xl relative overflow-hidden',
                    'transform hover:scale-105 active:scale-95',

                    // Variant styles
                    {
                        // Default - Clean white with subtle shadow
                        'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-soft hover:shadow-medium focus:ring-gray-300': variant === 'default',

                        // Primary - Ocean Blue
                        'bg-primary text-white hover:bg-primary-dark shadow-primary hover:shadow-lg focus:ring-primary/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700': variant === 'primary',

                        // Secondary - Sunset Orange
                        'bg-secondary text-white hover:bg-secondary-dark shadow-secondary hover:shadow-lg focus:ring-secondary/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700': variant === 'secondary',

                        // Outline - Travel themed
                        'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white shadow-soft hover:shadow-travel focus:ring-primary/50': variant === 'outline',

                        // Ghost - Subtle hover
                        'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300': variant === 'ghost',

                        // Travel - Multi-color gradient
                        'bg-gradient-travel text-white shadow-travel hover:shadow-xl focus:ring-primary/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700': variant === 'travel',

                        // Ocean - Ocean gradient
                        'bg-gradient-ocean text-white shadow-primary hover:shadow-xl focus:ring-primary/50': variant === 'ocean',

                        // Sunset - Sunset gradient
                        'bg-gradient-sunset text-white shadow-secondary hover:shadow-xl focus:ring-secondary/50': variant === 'sunset',
                    },

                    // Size styles
                    {
                        'h-9 px-3 text-sm [&>svg]:h-3.5 [&>svg]:w-3.5': size === 'sm',
                        'h-11 px-6 text-base [&>svg]:h-4 [&>svg]:w-4': size === 'md',
                        'h-12 px-8 text-lg [&>svg]:h-5 [&>svg]:w-5': size === 'lg',
                        'h-14 px-10 text-xl [&>svg]:h-6 [&>svg]:w-6': size === 'xl',
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