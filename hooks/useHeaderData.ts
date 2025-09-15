'use client';

import { useEffect, useState } from 'react';
import { getContentByType } from '../helper';
import { LunaParkHeaderEntry } from '../typescript/layout';

export function useHeaderData() {
    const [headerData, setHeaderData] = useState<LunaParkHeaderEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getContentByType('luna_park_header');
                if (response && response.length > 0) {
                    setHeaderData(response[0]);
                }
            } catch (err) {
                console.error('Error fetching header data:', err);
                setError('Failed to fetch header data. Please check your Contentstack configuration.');
            } finally {
                setLoading(false);
            }
        };

        fetchHeaderData();
    }, []);

    const handleDropdownToggle = (navItem: string) => {
        setActiveDropdown(activeDropdown === navItem ? null : navItem);
    };

    const handleDropdownEnter = (navItem: string) => {
        setActiveDropdown(navItem);
    };

    const handleDropdownLeave = () => {
        setActiveDropdown(null);
    };

    return {
        headerData,
        loading,
        error,
        activeDropdown,
        handleDropdownToggle,
        handleDropdownEnter,
        handleDropdownLeave,
    };
}
