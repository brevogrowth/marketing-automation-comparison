import React from 'react';
import Image from 'next/image';

export const Header: React.FC = () => {
  return (
    <header className="bg-brevo-dark-green sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <a href="https://www.brevo.com" target="_blank" rel="noopener noreferrer">
              <Image
                src="/brevo-logo-white.png"
                alt="Brevo"
                width={100}
                height={28}
                priority
              />
            </a>
            <span className="hidden sm:block text-gray-500">|</span>
            <span className="hidden sm:block text-sm font-medium text-gray-300">Marketing KPI Benchmark</span>
          </div>
          <a
            href="https://www.brevo.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brevo-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brevo-dark-green transition-colors"
          >
            Get a demo
          </a>
        </div>
      </div>
    </header>
  );
};
