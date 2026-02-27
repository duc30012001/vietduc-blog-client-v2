'use client';

import Markdown from 'react-markdown';

import { cn } from '@/libs/utils';

type MarkdownRendererProps = {
    content: string;
    className?: string;
};

export function MarkdownRenderer({
    content,
    className,
}: MarkdownRendererProps) {
    return (
        <div className={cn('prose prose-neutral dark:prose-invert', className)}>
            <Markdown>{content}</Markdown>
        </div>
    );
}
