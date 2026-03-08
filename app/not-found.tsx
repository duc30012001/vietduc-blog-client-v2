import Link from 'next/link';

import { EmptyState } from '@/components/empty-state';

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
                <EmptyState
                    title="Page not found"
                    description="The page you're looking for doesn't exist or has been moved."
                />
                <Link
                    href="/"
                    className="bg-accent hover:bg-accent/90 mt-6 inline-block rounded-lg px-6 py-3 font-semibold text-white transition-colors"
                >
                    Back to home
                </Link>
            </div>
        </div>
    );
}
