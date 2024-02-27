import { Box, Stack, Card, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useMeasure } from 'react-use';
import { useTranslation } from '@tyro/i18n';
import { ErrorBoundary } from '../error-boundary';

type MasonryGridBreakpoints = {
  default: number;
  [key: number]: number;
};

interface MasonryGridProps {
  gridItems: (React.ReactNode | false)[];
  breakpoints?: MasonryGridBreakpoints;
  spacing?: number;
}

const defaultBreakpoints: MasonryGridBreakpoints = {
  default: 3,
  1140: 2,
  760: 1,
};

const FallbackWidgetRenderer = () => {
  const { t } = useTranslation(['common']);
  return (
    <Card
      variant="soft"
      sx={{
        flex: 1,
      }}
    >
      <Card
        sx={{
          minHeight: 160,
        }}
      >
        <Stack
          sx={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" component="span" color="text.secondary">
            {t('common:errorLoadingWidget')}
          </Typography>
        </Stack>
      </Card>
    </Card>
  );
};

export function MasonryGrid({
  gridItems,
  breakpoints = defaultBreakpoints,
  spacing = 2,
}: MasonryGridProps) {
  const [tableContainerRef, { width }] = useMeasure<HTMLDivElement>();
  const filteredGridItems = gridItems.filter(Boolean);

  const sortedBreakpoints = useMemo(
    () =>
      Object.entries(breakpoints)
        .sort(([a], [b]) => {
          if (a === 'default') {
            return 1;
          }
          if (b === 'default') {
            return -1;
          }
          return Number(a) - Number(b);
        })
        .map(
          ([key, value]) =>
            ({
              breakpoint: key === 'default' ? key : Number(key),
              columns: value,
            } as const)
        ),
    [breakpoints]
  );

  const numberOfColumns = useMemo(
    () =>
      sortedBreakpoints.find(({ breakpoint }) =>
        breakpoint === 'default' ? true : width < breakpoint
      )?.columns ?? 1,
    [width, breakpoints]
  );

  return (
    <Stack
      ref={tableContainerRef}
      direction="row"
      alignItems="flex-start"
      spacing={spacing}
    >
      {Array.from({ length: numberOfColumns }, (_, index) => (
        <Box
          key={index}
          sx={{
            '&': {
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: spacing,
            },
          }}
        >
          {filteredGridItems
            .filter((_item, itemIndex) => itemIndex % numberOfColumns === index)
            .map((item, itemIndex) => (
              <ErrorBoundary
                key={itemIndex}
                FallbackComponent={FallbackWidgetRenderer}
              >
                {item}
              </ErrorBoundary>
            ))}
        </Box>
      ))}
    </Stack>
  );
}
