'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

type NuqsProviderProps = {
    children: React.ReactNode;
};

export function NuqsProvider({ children }: NuqsProviderProps) {
    return <NuqsAdapter>{children}</NuqsAdapter>;
}
