'use client';

import React from 'react';
import { Card, Skeleton, SkeletonText } from '@brevogrowth/brevo-tools-ui-kit';

export function MALoadingState() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton variant="rounded" width="100%" height={44} className="flex-1" />
          <Skeleton variant="rounded" width={160} height={44} />
          <Skeleton variant="rounded" width={112} height={44} />
        </div>
      </Card>

      {/* Vendor card skeletons */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} padding="md">
          <div className="flex items-start gap-4">
            {/* Logo placeholder */}
            <Skeleton variant="rounded" width={56} height={56} />

            {/* Content placeholder */}
            <div className="flex-1 space-y-3">
              <Skeleton variant="text" width="33%" height={20} />
              <Skeleton variant="text" width="66%" height={16} />
              <div className="flex gap-2">
                <Skeleton variant="rounded" width={64} height={20} />
                <Skeleton variant="rounded" width={80} height={20} />
              </div>
            </div>

            {/* Score placeholder */}
            <div className="text-right space-y-2">
              <Skeleton variant="rounded" width={48} height={32} className="ml-auto" />
              <Skeleton variant="text" width={64} height={16} className="ml-auto" />
            </div>
          </div>

          {/* Sections placeholder */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <SkeletonText lines={3} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function MASidebarLoadingState() {
  return (
    <div className="sticky top-4 space-y-4">
      {/* Profile skeleton */}
      <Card padding="none">
        <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Skeleton variant="rounded" width={32} height={32} />
            <div className="space-y-2">
              <Skeleton variant="text" width={96} height={16} />
              <Skeleton variant="text" width={128} height={12} />
            </div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton variant="text" width={80} height={16} />
              <Skeleton variant="rounded" width="100%" height={40} />
            </div>
          ))}
        </div>
      </Card>

      {/* Advanced skeleton */}
      <Card padding="none" className="border-dashed">
        <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Skeleton variant="rounded" width={32} height={32} />
            <div className="space-y-2">
              <Skeleton variant="text" width={112} height={16} />
              <Skeleton variant="text" width={144} height={12} />
            </div>
          </div>
        </div>
        <div className="p-5">
          <Skeleton variant="rounded" width="100%" height={96} />
        </div>
      </Card>
    </div>
  );
}
