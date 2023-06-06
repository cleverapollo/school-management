import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

type BreakpointValues<T> = {
  [key in Breakpoint]?: T;
} & {
  base?: T;
};

interface UseBreakpointValueOptions {
  type: 'up' | 'down' | 'not';
}

export function useBreakpointValue<T>(
  values: BreakpointValues<T>,
  options?: UseBreakpointValueOptions
): T | undefined {
  const { breakpoints } = useTheme();
  const { type = 'up' } = options || {};

  const xs = useMediaQuery(breakpoints[type]('xs'), {
    noSsr: true,
  });
  const sm = useMediaQuery(breakpoints[type]('sm'), {
    noSsr: true,
  });
  const md = useMediaQuery(breakpoints[type]('md'), {
    noSsr: true,
  });
  const lg = useMediaQuery(breakpoints[type]('lg'), {
    noSsr: true,
  });
  const xl = useMediaQuery(breakpoints[type]('xl'), {
    noSsr: true,
  });

  return useMemo(() => {
    const isBreakpointMatched = {
      xs,
      sm,
      md,
      lg,
      xl,
    };
    const breakpointKeys = (
      type === 'up'
        ? Object.keys(isBreakpointMatched).reverse()
        : Object.keys(isBreakpointMatched)
    ) as Breakpoint[];
    const firstMatchedBreakpoint =
      breakpointKeys.find(
        (breakpoint) =>
          Boolean(values[breakpoint]) && isBreakpointMatched[breakpoint]
      ) || 'base';

    return firstMatchedBreakpoint ? values[firstMatchedBreakpoint] : undefined;
  }, [values, xs, sm, md, lg, xl, type]);
}
