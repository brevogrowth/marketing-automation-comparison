'use client';

import React from 'react';

export function MALoadingState() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 h-11 bg-gray-200 rounded-lg" />
          <div className="w-40 h-11 bg-gray-200 rounded-lg" />
          <div className="w-28 h-11 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Vendor card skeletons */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse"
        >
          <div className="flex items-start gap-4">
            {/* Logo placeholder */}
            <div className="w-14 h-14 bg-gray-200 rounded-lg" />

            {/* Content placeholder */}
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-gray-200 rounded" />
                <div className="h-5 w-20 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Score placeholder */}
            <div className="text-right space-y-2">
              <div className="h-8 w-12 bg-gray-200 rounded ml-auto" />
              <div className="h-4 w-16 bg-gray-200 rounded ml-auto" />
            </div>
          </div>

          {/* Sections placeholder */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MASidebarLoadingState() {
  return (
    <div className="space-y-6">
      {/* Profile filters skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-10 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Advanced filters skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-24 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}
