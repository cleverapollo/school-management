import { Suspense } from 'react';
import { LoadingScreen } from './loading-screen';

export { LoadingScreen } from './loading-screen';

export interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyLoader({
  children,
  fallback = <LoadingScreen />,
}: LazyLoaderProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
