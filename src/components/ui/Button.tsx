import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'info';
    isActive?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isActive,
    className = '',
    ...props
}) => {
    const baseStyles = 'font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    // Default padding and rounding if not overridden in className
    const defaultLayout = className.includes('p-') || className.includes('px-') || className.includes('py-')
        ? ''
        : 'px-8 py-3';
    const defaultRounded = className.includes('rounded-')
        ? ''
        : 'rounded-2xl';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20',
        secondary: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
        outline: 'bg-transparent border border-zinc-200 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-500 dark:text-zinc-300',
        ghost: 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400',
        success: 'bg-green-500 text-white hover:bg-green-400',
        info: 'bg-blue-500 text-white hover:bg-blue-400',
    };

    const activeStyles = isActive !== undefined
        ? (isActive
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700')
        : variants[variant];

    const finalStyles = `${baseStyles} ${defaultLayout} ${defaultRounded} ${activeStyles} ${className}`;

    return (
        <button className={finalStyles} {...props}>
            {children}
        </button>
    );
};

export default Button;
