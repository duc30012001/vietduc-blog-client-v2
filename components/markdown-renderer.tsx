'use client';

import type { Components } from 'react-markdown';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '@/libs/utils';

type MarkdownRendererProps = {
    content: string;
    className?: string;
};

const components: Components = {
    table: ({ children, ...props }) => (
        <div className="overflow-x-auto">
            <table {...props}>{children}</table>
        </div>
    ),
    pre: ({ children, ...props }) => (
        <pre className="overflow-x-auto" {...props}>
            {children}
        </pre>
    ),
    a: ({ children, ...props }) => (
        <a className="no-underline hover:underline" {...props}>
            {children}
        </a>
    ),
};

export function MarkdownRenderer({
    content,
    className,
}: MarkdownRendererProps) {
    return (
        <div
            className={cn(
                'prose prose-neutral dark:prose-invert',
                // Custom colors only
                'prose-headings:text-text-primary',
                'prose-a:text-accent',
                'prose-code:text-accent',
                'prose-blockquote:border-accent prose-blockquote:text-text-secondary',
                'prose-th:bg-surface prose-th:text-text-primary',
                className,
            )}
        >
            <Markdown remarkPlugins={[remarkGfm]} components={components}>
                {content}
            </Markdown>
        </div>
    );
}
