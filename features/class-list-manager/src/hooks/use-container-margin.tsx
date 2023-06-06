import { useResponsive } from '@tyro/core';

export function useContainerMargin() {
  const isDesktop = useResponsive('up', 'lg');
  const isSm = useResponsive('up', 'sm');

  const pageMargin = isDesktop ? 2 : 0;
  const containerMargin = isSm ? 3 : 2;

  return pageMargin + containerMargin;
}
