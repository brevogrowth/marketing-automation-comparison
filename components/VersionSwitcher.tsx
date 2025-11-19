'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const VersionSwitcher: React.FC = () => {
  const pathname = usePathname();
  const isV1 = pathname === '/' || pathname === '/v1';
  const isV2 = pathname === '/v2';
  const isV3 = pathname === '/v3';

  return (
    <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
      <Link
        href="/"
        className={`px-4 py-2 rounded-md font-medium transition-colors ${isV1
            ? 'bg-brevo-green text-white'
            : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        Version 1
      </Link>
      <Link
        href="/v2"
        className={`px-4 py-2 rounded-md font-medium transition-colors ${isV2
            ? 'bg-brevo-green text-white'
            : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        Version 2
      </Link>
      <Link
        href="/v3"
        className={`px-4 py-2 rounded-md font-medium transition-colors ${isV3
            ? 'bg-brevo-green text-white'
            : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        Version 3
      </Link>
      <Link
        href="/v4"
        className={`px-4 py-2 rounded-md font-medium transition-colors ${pathname === '/v4'
            ? 'bg-brevo-green text-white'
            : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        Version 4
      </Link>
    </div>
  );
};
