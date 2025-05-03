import { Suspense } from 'react';

export default function SearchLayout({ children }) {
    return (
        <Suspense fallback={<div className="flex items-center justify-center w-full p-12">Loading...</div>}>
            {children}
        </Suspense>
    );
}