import Image from 'next/image';

import { cn } from '@/libs/utils';

// ==================== Types ====================

interface EmptyStateProps {
    title: string;
    description?: string;
    className?: string;
}

// ==================== Component ====================

export function EmptyState({ title, description, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-16 text-center',
                className,
            )}
        >
            <Image
                src="/not_found.png"
                alt={title}
                width={600}
                height={600}
                className="mb-6"
                priority={false}
            />
            <h2 className="text-text-primary mb-2 text-xl font-semibold">
                {title}
            </h2>
            {description && (
                <p className="text-text-muted max-w-md text-base">
                    {description}
                </p>
            )}
        </div>
    );
}
