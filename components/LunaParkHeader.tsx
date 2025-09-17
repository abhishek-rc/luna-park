'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHeaderData } from '../hooks/useHeaderData';
import { useCart } from '../contexts/CartContext';

export default function LunaParkHeader() {
    const router = useRouter();
    const { openCart, state } = useCart();
    const {
        headerData,
        loading,
        error,
        activeDropdown,
        handleDropdownEnter,
        handleDropdownLeave,
    } = useHeaderData();


    if (loading) {
        return (
            <header className="bg-[#2a324a] text-white py-4 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse flex items-center justify-between">
                        <div className="h-8 bg-[#2a324a]  rounded w-32"></div>
                        <div className="flex space-x-4">
                            <div className="h-6 bg-[#2a324a] rounded w-20"></div>
                            <div className="h-6 bg-[#2a324a] rounded w-20"></div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    if (error || !headerData) {
        return (
            <header className="bg-blue-900 text-white py-4 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <p className="text-red-300">Error loading header</p>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-[#2a324a] text-white sticky top-0 z-50">
            <div className="container mx-auto px-20">
                <div className="flex items-center justify-between py-3">
                    {/* Primary Navigation */}
                    <nav className="hidden md:flex items-center space-x-6 cursor-pointer">
                        <Link href="/">
                            <Image
                                src={headerData?.site_logo?.url || '/'}
                                alt={headerData?.site_logo?.title || 'Logo'}
                                width={120}
                                height={40}
                                className="h-8 w-auto cursor-pointer"
                            />
                        </Link>
                        {headerData?.primary_navigation?.map((navItem) => (
                            <div
                                key={navItem?._metadata?.uid}
                                className="relative group"
                                onMouseEnter={() => navItem?.has_dropdown && handleDropdownEnter(navItem?._metadata?.uid)}
                                onMouseLeave={handleDropdownLeave}
                            >
                                <a
                                    href={navItem?.navigation_url?.href || '#'}
                                    className="flex items-center space-x-1 text-xs text-[#f9ebd1] transition-colors duration-200 font-medium cursor-pointer"
                                >
                                    <span>{navItem?.navigation_url?.title}</span>
                                </a>

                                {/* Dropdown Menu */}
                                {navItem?.has_dropdown && navItem?.dropdown_items?.length > 0 && (
                                    <div
                                        className={`absolute top-full left-0 mt-10 w-56 bg-[#2a324a] rounded-lg shadow-xl py-3 z-50 transition-all duration-200 ${activeDropdown === navItem?._metadata?.uid
                                            ? 'opacity-100 visible translate-y-0'
                                            : 'opacity-0 invisible -translate-y-2'
                                            }`}
                                    >
                                        {/* Arrow pointer */}
                                        <div className="absolute -top-1.5 left-6 w-4 h-4 bg-[#2a324a] transform rotate-45 rounded-sm"></div>
                                        {navItem?.dropdown_items?.map((dropdownItem) => (
                                            <a
                                                key={dropdownItem?._metadata?.uid}
                                                href={dropdownItem?.dropdown_url?.href || '#'}
                                                className="block px-4 py-1.5 text-[#f9ebd1] transition-colors duration-200 text-xs font-medium"
                                            >
                                                {dropdownItem?.dropdown_url?.title}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-10 text-xs">
                        {/* Today's Hours */}
                        <div className='text-[#f9ebd1]'>
                            <div className="hidden lg:flex items-center space-x-2 font-semibold pb-0.5">
                                <span>TODAY&apos;S HOURS</span>
                                <span>10:00 AM-8:00 PM</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>Sunday</span>
                                <span>10:00 AM-8:00 PM</span>
                                <button>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        </div>


                        {/* Call to Action Button */}
                        <button
                            onClick={() => router.push(headerData?.call_to_action_buttons?.button_url?.href || '/')}
                            className="bg-[#aa3030] text-[#f9ebd1] px-6 py-2.5 text-sm rounded-full font-bold transition-colors duration-200 cursor-pointer"
                        >
                            {headerData?.call_to_action_buttons?.button_url?.title || 'Book Now'}
                        </button>

                        {/* User Actions */}
                        <div className="flex items-center space-x-2">
                            {headerData?.user_actions?.show_login && (
                                <Link
                                    href={headerData?.user_actions?.login_url?.href || '#'}
                                    className="flex items-center space-x-1 text-white hover:text-orange-400 transition-colors duration-200 text-sm"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 512 512"
                                        className="w-5 h-5"
                                    >
                                        <g>
                                            <path
                                                d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0"
                                                fill="#faeacf"
                                                opacity="1"
                                            />
                                        </g>
                                    </svg>
                                    <span className="hidden sm:inline text-xs text-[#f9ebd1]">{headerData?.user_actions?.login_url?.title}</span>
                                </Link>
                            )}

                            <span className="text-[#007aff]">|</span>

                            {headerData?.user_actions?.show_signup && (
                                <a
                                    href={headerData?.user_actions?.signup_url?.href || '#'}
                                    className="flex items-center space-x-1 text-white hover:text-orange-400 transition-colors duration-200"
                                >
                                    <span className="hidden sm:inline text-[#f9ebd1] text-xs">{headerData?.user_actions?.signup_url?.title}</span>
                                </a>
                            )}

                            {headerData?.user_actions?.show_cart && (
                                <button
                                    onClick={openCart}
                                    className="relative flex items-center space-x-1 text-white hover:text-orange-400 transition-colors duration-200"
                                >
                                    <Image
                                        src={headerData?.user_actions?.cart_icon?.url || '/'}
                                        alt={headerData?.user_actions?.cart_icon?.title || 'Cart'}
                                        width={20}
                                        height={20}
                                        className="w-6 h-6"
                                    />
                                    {state.totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-[#aa3030] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {state.totalItems}
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden text-white hover:text-orange-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t border-blue-800 py-4">
                    <nav className="space-y-2">
                        {headerData?.primary_navigation?.map((navItem) => (
                            <div key={navItem?._metadata?.uid}>
                                <a
                                    href={navItem?.navigation_url?.href || '#'}
                                    className="block py-2 text-white hover:text-orange-400 transition-colors duration-200"
                                >
                                    {navItem?.navigation_url?.title || 'Link'}
                                </a>
                                {navItem?.has_dropdown && navItem?.dropdown_items?.length > 0 && (
                                    <div className="ml-4 space-y-1">
                                        {navItem?.dropdown_items?.map((dropdownItem) => (
                                            <a
                                                key={dropdownItem?._metadata?.uid}
                                                href={dropdownItem?.dropdown_url?.href || '#'}
                                                className="block py-1 text-gray-300 hover:text-orange-400 transition-colors duration-200"
                                            >
                                                {dropdownItem?.dropdown_url?.title || 'Sub Link'}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}
