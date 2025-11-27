import React from 'react';
import Image from 'next/image';

interface Partner {
    name: string;
    logo: string;
    description: string;
    website: string;
}

const partners: Partner[] = [
    {
        name: 'Cartelis',
        logo: '/cartelis-logo.svg',
        description: 'Operational consulting firm specializing in data strategy and CRM. Helped define benchmark methodology and industry segmentation.',
        website: 'https://www.cartelis.com'
    },
    {
        name: 'Epsilon',
        logo: '/epsilon-logo.svg',
        description: 'Marketing technology leader enabling personalized customer engagement. Contributed acquisition and retention metrics standards.',
        website: 'https://www.epsilon.com'
    },
    {
        name: 'Niji',
        logo: '/niji-logo.svg',
        description: 'French digital transformation consulting and technology company. Provided e-commerce conversion benchmarks and UX insights.',
        website: 'https://www.niji.fr'
    }
];

export const Contributors: React.FC = () => {
    return (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mt-8">
            <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Thanks to our expert partners</h3>
                <p className="text-sm text-gray-600 mt-1">
                    These industry experts collaborated on building this benchmark framework.
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
                            {partner.description}
                        </p>
                    </a>
                ))}
            </div>
        </div>
    );
};
