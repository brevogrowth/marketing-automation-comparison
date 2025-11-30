'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface Partner {
    name: string;
    logo: string;
    descriptionKey: 'cartelis' | 'epsilon' | 'niji';
    website: string;
}

interface Expert {
    id: string;
    name: string;
    photo: string;
    linkedinUrl: string;
}

const partners: Partner[] = [
    {
        name: 'Cartelis',
        logo: '/cartelis-logo.svg',
        descriptionKey: 'cartelis',
        website: 'https://www.cartelis.com'
    },
    {
        name: 'Epsilon',
        logo: '/epsilon-logo.svg',
        descriptionKey: 'epsilon',
        website: 'https://www.epsilon.com'
    },
    {
        name: 'Niji',
        logo: '/niji-logo.svg',
        descriptionKey: 'niji',
        website: 'https://www.niji.fr'
    }
];

const experts: Expert[] = [
    {
        id: 'expert1',
        name: 'Sophie Martin',
        photo: '/experts/expert1.jpg',
        linkedinUrl: 'https://www.linkedin.com/in/'
    },
    {
        id: 'expert2',
        name: 'Thomas Dubois',
        photo: '/experts/expert2.jpg',
        linkedinUrl: 'https://www.linkedin.com/in/'
    },
    {
        id: 'expert3',
        name: 'Marie Laurent',
        photo: '/experts/expert3.jpg',
        linkedinUrl: 'https://www.linkedin.com/in/'
    },
    {
        id: 'expert4',
        name: 'Pierre Bernard',
        photo: '/experts/expert4.jpg',
        linkedinUrl: 'https://www.linkedin.com/in/'
    },
    {
        id: 'expert5',
        name: 'Claire Moreau',
        photo: '/experts/expert5.jpg',
        linkedinUrl: 'https://www.linkedin.com/in/'
    },
    {
        id: 'expert6',
        name: 'Antoine Petit',
        photo: '/experts/expert6.jpg',
        linkedinUrl: 'https://www.linkedin.com/in/'
    }
];

export const Contributors: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mt-8">
            <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{t.contributors.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                    {t.contributors.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {partners.map((partner) => (
                    <a
                        key={partner.name}
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-lg p-4 border border-gray-200 hover:border-brevo-green hover:shadow-md transition-all group"
                    >
                        <div className="h-12 flex items-center justify-center mb-3">
                            <Image
                                src={partner.logo}
                                alt={partner.name}
                                width={120}
                                height={40}
                                className="object-contain max-h-10"
                            />
                        </div>
                        <p className="text-sm text-gray-600 text-center leading-relaxed">
                            {t.contributors[partner.descriptionKey]}
                        </p>
                    </a>
                ))}
            </div>

            {/* Market Experts Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-center mb-6">
                    <h4 className="text-md font-semibold text-gray-900">{t.contributors.expertsTitle}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                        {t.contributors.expertsSubtitle}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {experts.map((expert) => {
                        const expertTranslations = t.contributors.experts?.[expert.id as keyof typeof t.contributors.experts];
                        return (
                            <div
                                key={expert.id}
                                className="bg-white rounded-lg p-3 border border-gray-200 hover:border-brevo-green hover:shadow-md transition-all text-center"
                            >
                                <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brevo-green/20 to-brevo-green/40 flex items-center justify-center">
                                        <span className="text-2xl text-brevo-dark-green font-semibold">
                                            {expertTranslations?.name?.charAt(0) || expert.name.charAt(0)}
                                        </span>
                                    </div>
                                </div>
                                <h5 className="text-sm font-medium text-gray-900 mb-1">
                                    {expertTranslations?.name || expert.name}
                                </h5>
                                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                                    {expertTranslations?.role || ''}
                                </p>
                                <a
                                    href={expertTranslations?.linkedin || expert.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0077B5] hover:bg-[#005582] transition-colors"
                                    aria-label={`LinkedIn profile of ${expertTranslations?.name || expert.name}`}
                                >
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
