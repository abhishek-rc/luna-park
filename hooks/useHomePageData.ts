'use client';

import { useEffect, useState } from 'react';
import { getContentByType } from '../helper';
import { HomepageEntry } from '../typescript/layout';

export function useHomePageData() {
    const [homepageData, setHomepageData] = useState<HomepageEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHomepageData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getContentByType('homepage_ticketbooking_navigation_tabs');
                if (response && response.length > 0) {
                    setHomepageData(response[0]);
                }
            } catch (err) {
                console.error('Error fetching homepage data:', err);
                setError('Failed to fetch homepage data. Please check your Contentstack configuration.');
            } finally {
                setLoading(false);
            }
        };

        fetchHomepageData();
    }, []);

    return {
        homepageData,
        loading,
        error,
    };
}
