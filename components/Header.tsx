import React from 'react';

const BrevoLogo = () => (
  <svg width="106" height="32" viewBox="0 0 106 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Brevo Icon */}
    <path d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16Z" fill="#0B996E"/>
    <path d="M21.0024 14.5395C21.9917 13.5708 22.4552 12.4513 22.4552 11.0897C22.4552 8.27639 20.3848 6.4 17.2642 6.4H9.6V26.4H15.7803C20.478 26.4 24 23.5258 24 19.7135C24 17.6254 22.9188 15.7502 21.0024 14.5395ZM12.3813 9.00158H16.9547C18.4995 9.00158 19.5198 9.87892 19.5198 11.2101C19.5198 12.7227 18.1913 13.8726 15.4721 14.7499C13.6179 15.3242 12.784 15.8086 12.4746 16.3842L12.3813 16.385V9.00158ZM15.533 23.7984H12.3813V20.7125C12.3813 19.3509 13.5558 18.0197 15.1937 17.5049C16.6466 17.0206 17.8508 16.5363 18.8711 16.0228C20.2307 16.8101 21.0646 18.1705 21.0646 19.593C21.0646 22.0133 18.7157 23.7984 15.533 23.7984Z" fill="white"/>
    {/* Brevo Text */}
    <path d="M44.8 7.2H49.6C52.8 7.2 54.8 9.2 54.8 12C54.8 13.6 54 14.8 52.8 15.6C54.4 16.4 55.6 18 55.6 20C55.6 23.2 53.2 25.6 49.6 25.6H44.8V7.2ZM49.2 14.4C50.8 14.4 51.6 13.4 51.6 12.2C51.6 11 50.8 10 49.2 10H48V14.4H49.2ZM49.6 22.8C51.4 22.8 52.4 21.6 52.4 20C52.4 18.4 51.4 17.2 49.6 17.2H48V22.8H49.6Z" fill="#0B996E"/>
    <path d="M57.6 7.2H62.4C65.6 7.2 67.6 9.2 67.6 12.4C67.6 15 66.2 16.8 64 17.4L68 25.6H64.4L60.8 18H60.8V25.6H57.6V7.2ZM62 15.2C63.6 15.2 64.4 14.2 64.4 12.6C64.4 11 63.6 10 62 10H60.8V15.2H62Z" fill="#0B996E"/>
    <path d="M69.6 7.2H79.6V10H72.8V14.4H78.8V17.2H72.8V22.8H79.6V25.6H69.6V7.2Z" fill="#0B996E"/>
    <path d="M84.4 7.2H88L92.4 25.6H89.2L88.4 22H84L83.2 25.6H80L84.4 7.2ZM87.6 19.2L86.2 12.4L84.8 19.2H87.6Z" fill="#0B996E"/>
    <path d="M97.2 7.2H100.4L104.8 20.4V7.2H108V25.6H104.8L100.4 12.4V25.6H97.2V7.2Z" fill="#0B996E"/>
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <a href="https://www.brevo.com" target="_blank" rel="noopener noreferrer">
              <BrevoLogo />
            </a>
            <span className="hidden sm:block text-gray-300">|</span>
            <span className="hidden sm:block text-sm font-medium text-gray-600">Marketing KPI Benchmark</span>
          </div>
          <a
            href="https://www.brevo.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brevo-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brevo-dark-green transition-colors"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </header>
  );
};
