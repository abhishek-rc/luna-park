'use client';

import { useEffect, useState } from 'react';
import { getContentByType } from '../helper';
import Image from 'next/image';

// Constants
const FOOTER_STYLES = {
  backgroundColor: '#2B324B',
  color: '#F9EBD1',
  fontSize: '18px',
  fontFamily: 'brevia, sans-serif',
} as const;

const TEXT_STYLES = {
  primary: { color: '#F9EBD1', fontSize: '16px', fontFamily: 'brevia, sans-serif' },
  heading: { color: '#F9EBD1', fontSize: '18px', fontFamily: 'brevia, sans-serif' },
  largeHeading: { color: '#F9EBD1', fontSize: '20px', fontFamily: 'brevia, sans-serif' },
  link: { fontSize: '14px', textUnderlineOffset: '4px' },
  bottomText: { color: '#2A324A', fontSize: '16px', fontFamily: 'omnes-pro, sans-serif' },
  bottomSmall: { color: '#2D3249', fontSize: '14px', fontFamily: 'omnes-pro, sans-serif' },
} as const;

// Types
interface FooterData {
  title?: string;
  logo?: {
    url: string;
    title: string;
  };
  contact_info?: {
    address: string;
    hours: string;
    map_description: string;
  };
  newsletter?: {
    heading: string;
    description: string;
  };
  navigation_sections?: Array<{
    section_title: {
      section_title: string;
      links: Array<{
        link: {
          link_text: string;
          link_url: string;
        };
      }>;
    };
  }>;
  social_media?: Array<{
    social_link: {
      platform: string;
      url: string;
      icon?: {
        url: string;
        title: string;
      };
    };
  }>;
  legal_links?: Array<{
    legal_link: {
      link_text: string;
      link_url: string;
    };
  }>;
  partnership?: {
    text: string;
    partner_name: string;
    partner_url: string;
  };
  payment_methods?: Array<{
    payment_method: {
      method_name: string;
      logo?: {
        url: string;
        title: string;
      };
    };
  }>;
}

// Helper Components
const ContactInfoBox = ({ 
  icon, 
  title, 
  content, 
  linkText, 
  linkHref = "#" 
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  linkText: string;
  linkHref?: string;
}) => (
  <div className="flex flex-col items-start" style={{ width: '200px' }}>
    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mb-6">
      {icon}
    </div>
    <h3 className="font-bold mb-4 tracking-wider text-left" style={TEXT_STYLES.primary}>
      {title}
    </h3>
    <p className="mb-6 leading-relaxed text-left" style={TEXT_STYLES.primary}>
      {content}
    </p>
    <a
      href={linkHref}
      className="text-white hover:text-gray-300 underline hover:no-underline transition-all duration-200 font-medium text-left mt-2"
      style={TEXT_STYLES.link}
    >
      {linkText}
    </a>
  </div>
);

const NewsletterForm = () => (
  <div className="mb-10">
    <div className="flex">
      <input
        type="email"
        placeholder="Email Address"
        className="flex-1 px-5 py-4 bg-white text-gray-900 border-0 focus:ring-2 focus:ring-amber-500 focus:outline-none rounded-l-lg"
        style={{ fontSize: '16px' }}
      />
      <button 
        className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 font-medium transition-all duration-200 hover:shadow-lg whitespace-nowrap rounded-r-lg" 
        style={{ fontSize: '16px' }}
      >
        SIGN UP
      </button>
    </div>
  </div>
);

const SocialMediaIcons = ({ socialMedia }: { socialMedia: FooterData['social_media'] }) => (
  <div className="flex gap-6">
    {socialMedia?.map((social, index) => (
      <a
        key={index}
        href={social.social_link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
      >
        {social.social_link.icon && (
          <Image
            src={social.social_link.icon.url}
            alt={social.social_link.platform}
            width={28}
            height={28}
            className="w-7 h-7"
          />
        )}
      </a>
    ))}
  </div>
);

const NavigationSection = ({ section }: { section: NonNullable<FooterData['navigation_sections']>[0] }) => (
  <div style={{ width: '200px' }}>
    <h4 className="font-bold mb-8 tracking-wide" style={TEXT_STYLES.heading}>
      {section.section_title.section_title}
    </h4>
    <ul className="space-y-5 mb-0">
      {section.section_title.links?.map((link: any, linkIndex: number) => (
        <li key={linkIndex} className="mb-0">
          <a
            href={link.link.link_url}
            className="hover:text-amber-400 transition-colors duration-200 leading-relaxed"
            style={TEXT_STYLES.primary}
          >
            {link.link.link_text}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Main Component
export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getContentByType('footer');
        
        if (response && response.length > 0) {
          setFooterData(response[0]);
        } else {
          setError('No footer data available');
        }
      } catch (err) {
        console.error('Error fetching footer data:', err);
        setError('Failed to load footer data');
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  // Loading and Error States
  if (loading) {
    return (
      <footer className="text-white" style={{ backgroundColor: '#202020' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2">Loading footer...</p>
          </div>
        </div>
      </footer>
    );
  }

  if (error || !footerData) {
    return (
      <footer className="text-white" style={{ backgroundColor: '#202020' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-300">Error loading footer: {error}</p>
            <p className="text-yellow-300 mt-2">Please check your Contentstack configuration and ensure the footer entry is published.</p>
          </div>
        </div>
      </footer>
    );
  }

  // Icons
  const locationIcon = (
    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  );

  const clockIcon = (
    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  );

  const mapIcon = (
    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v10h10V5H5z" clipRule="evenodd" />
    </svg>
  );

  return (
    <footer className="text-white" style={FOOTER_STYLES}>
      {/* Top Section - Logo and Contact Info */}
      <div className="border-b border-gray-600">
        <div className="container mx-auto px-62 py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-50">
            {/* Logo */}
            <div className="flex-shrink-0">
              {footerData.logo && (
                <Image
                  src={footerData.logo.url}
                  alt={footerData.logo.title || 'Logo'}
                  width={800}
                  height={240}
                  className="h-40 w-auto"
                />
              )}
            </div>

            {/* Contact Information */}
            <div className="flex flex-col md:flex-row gap-16 flex-1">
              <ContactInfoBox
                icon={locationIcon}
                title="OUR ADDRESS"
                content={footerData.contact_info?.address || ''}
                linkText="GET DIRECTIONS"
              />
              <ContactInfoBox
                icon={clockIcon}
                title="TODAY'S HOURS"
                content={footerData.contact_info?.hours || ''}
                linkText="VIEW ALL"
              />
              <ContactInfoBox
                icon={mapIcon}
                title="PARK MAP"
                content={footerData.contact_info?.map_description || ''}
                linkText="VIEW MAP"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="container mx-auto px-62 py-16">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Newsletter Section */}
          <div className="lg:w-1/3">
            <h3 className="font-bold mb-6" style={TEXT_STYLES.largeHeading}>
              {footerData.newsletter?.heading}
            </h3>
            <p className="mb-6 leading-relaxed" style={TEXT_STYLES.primary}>
              {footerData.newsletter?.description}
            </p>
            
            <NewsletterForm />
            <SocialMediaIcons socialMedia={footerData.social_media} />
          </div>

          {/* Navigation Sections */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-40">
              {footerData.navigation_sections?.map((section, index) => (
                <NavigationSection key={index} section={section} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-amber-50 text-gray-800 border-t border-gray-300">
        <div className="container mx-auto px-62 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Legal Links */}
            <div className="flex flex-wrap gap-10">
              {footerData.legal_links?.map((link, index) => (
                <a
                  key={index}
                  href={link.legal_link.link_url}
                  className="font-medium hover:text-amber-700 transition-colors duration-200"
                  style={TEXT_STYLES.bottomText}
                >
                  {link.legal_link.link_text}
                </a>
              ))}
            </div>

            {/* Partnership */}
            <div className="text-center">
              <p style={TEXT_STYLES.bottomSmall}>
                {footerData.partnership?.text} -{' '}
                <a
                  href={footerData.partnership?.partner_url}
                  className="text-amber-700 hover:text-amber-800 font-bold transition-colors duration-200"
                  style={TEXT_STYLES.bottomSmall}
                >
                  {footerData.partnership?.partner_name}
                </a>
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex gap-4">
              {footerData.payment_methods?.map((method, index) => (
                <div key={index} className="flex items-center">
                  {method.payment_method.logo && (
                    <Image
                      src={method.payment_method.logo.url}
                      alt={method.payment_method.method_name}
                      width={30}
                      height={18}
                      className="h-6 w-auto"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
