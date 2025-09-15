'use client';

import { useEffect, useState } from 'react';
import { getContentByType } from '../helper';

export default function ContentstackExample() {
    const [content, setContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContent = async (type: string) => {
        try {
            setLoading(true);
            setError(null);
            console.log(`Fetching ${type} content...`);
            const response = await getContentByType(type);
            console.log(`${type} response:`, response);
            setContent(response || []);
        } catch (err) {
            console.error('Error fetching content:', err);
            setError(`Failed to fetch ${type} content. Please check your Contentstack configuration.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent('homepage_ticketbooking_navigation_tabs');
    }, []);

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading content from Contentstack...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <></>
    );
}
