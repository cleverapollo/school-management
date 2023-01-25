import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

type BreakpointValues<T> = {
  [key in Breakpoint]: T;
};

export function useBreakpointValue<T>(
  values: BreakpointValues<T>
): T | undefined {
  const { breakpoints } = useTheme();
  const xs = useMediaQuery(breakpoints.up('xs'), {
    noSsr: true,
  });
  const sm = useMediaQuery(breakpoints.up('sm'), {
    noSsr: true,
  });
  const md = useMediaQuery(breakpoints.up('md'), {
    noSsr: true,
  });
  const lg = useMediaQuery(breakpoints.up('lg'), {
    noSsr: true,
  });
  const xl = useMediaQuery(breakpoints.up('xl'), {
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
    const breakpointKeys = Object.keys(isBreakpointMatched) as Breakpoint[];
    const firstMatchedBreakpoint = breakpointKeys.find(
      (breakpoint) =>
        Boolean(values[breakpoint]) && isBreakpointMatched[breakpoint]
    );

    return firstMatchedBreakpoint ? values[firstMatchedBreakpoint] : undefined;
  }, [values, xs, sm, md, lg, xl]);
}
