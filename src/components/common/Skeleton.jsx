import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-[#222224] rounded-xl ${className}`} />;
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[#222224] last:border-0">
            <div className="space-y-1.5 flex-1 pr-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Top 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 bg-[#151517] border border-[#2d2d30] rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Middle charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#151517] border border-[#2d2d30] rounded-2xl p-5 h-72">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="lg:col-span-5 bg-[#151517] border border-[#2d2d30] rounded-2xl p-5 h-72">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-48 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
};
