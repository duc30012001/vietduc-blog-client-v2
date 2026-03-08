'use client';

import { useEffect, useRef, useState } from 'react';

import { type Theme, useTheme } from '@/components/theme-provider';
import { cn } from '@/libs/utils';

const THEME_OPTIONS: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
];

function ThemeIcon({ theme }: { theme: Theme }) {
    if (theme === 'light') {
        return (
            <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
            </svg>
        );
    }

    if (theme === 'dark') {
        return (
            <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
        );
    }

    return (
        <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
        </svg>
    );
}

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                id="theme-toggle-button"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle theme"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                className={cn(
                    'text-text-secondary flex h-9 items-center gap-1.5 rounded-lg px-2.5 font-medium transition-colors',
                    'hover:bg-surface-hover hover:text-accent',
                    isOpen && 'text-accent',
                )}
            >
                <ThemeIcon theme={theme} />
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    aria-label="Select theme"
                    className="border-border bg-background absolute top-full right-0 z-50 mt-2 min-w-[140px] rounded-lg border p-1 shadow-lg"
                >
                    {THEME_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            id={`theme-option-${value}`}
                            type="button"
                            role="option"
                            aria-selected={theme === value}
                            onClick={() => {
                                setTheme(value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                                theme === value
                                    ? 'bg-surface text-accent font-medium'
                                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                            )}
                        >
                            <ThemeIcon theme={value} />
                            <span>{label}</span>
                            {theme === value && (
                                <svg
                                    className="ml-auto h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
