'use client';

import { useHomePageData } from '../hooks/useHomePageData';
import ComponentMapper from './ComponentMapper';

export default function DynamicHomepage() {
    const { homepageData, loading, error } = useHomePageData();

    if (loading) {
        return (
            <div className="font-sans min-h-screen">
                <main>
                    <div className="relative h-[90vh] bg-[#2a324a] flex items-center justify-center">
                        <div className="container mx-auto px-4">
                            <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
                                <div className="h-8 bg-[#2a324a] rounded w-48"></div>
                                <div className="h-6 bg-[#2a324a] rounded w-32"></div>
                                <div className="h-12 bg-[#2a324a] rounded-full w-48"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !homepageData) {
        return (
            <div className="font-sans min-h-screen">
                <main>
                    <div className="relative h-[90vh] bg-gray-900 flex items-center justify-center">
                        <div className="text-center">
                            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                                <p className="font-bold">Error loading homepage</p>
                                <p>{error || 'No data available'}</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Extract modular blocks from the homepage data
    const modularBlocks = homepageData.modular_blocks || [];

    return (
        <div className="font-sans min-h-screen">
            <main>
                <ComponentMapper modularBlocks={modularBlocks} />
            </main>
        </div>
    );
}
