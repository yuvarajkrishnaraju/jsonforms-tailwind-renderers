import React, { Suspense, lazy } from 'react';

// Lazy load heavy controls that use Monaco Editor
const TailwindJsonControl = lazy(() => import('./TailwindJsonControl').then(module => ({ default: module.TailwindJsonControl })));
const TailwindSqlControl = lazy(() => import('./TailwindSqlControl').then(module => ({ default: module.TailwindSqlControl })));
const TailwindMemoryControl = lazy(() => import('./TailwindMemoryControl').then(module => ({ default: module.TailwindMemoryControl })));

// Fallback component for loading states
const ControlFallback = () => (
  <div className="tw-flex tw-items-center tw-justify-center tw-h-32 tw-bg-gray-100 tw-border tw-border-gray-300 tw-rounded tw-text-gray-500">
    Loading advanced control...
  </div>
);

// Wrapper components with Suspense
export const LazyTailwindJsonControl = (props: any) => (
  <Suspense fallback={<ControlFallback />}>
    <TailwindJsonControl {...props} />
  </Suspense>
);

export const LazyTailwindSqlControl = (props: any) => (
  <Suspense fallback={<ControlFallback />}>
    <TailwindSqlControl {...props} />
  </Suspense>
);

export const LazyTailwindMemoryControl = (props: any) => (
  <Suspense fallback={<ControlFallback />}>
    <TailwindMemoryControl {...props} />
  </Suspense>
);
