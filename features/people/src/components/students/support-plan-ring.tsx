import { Box, BoxProps, useTheme } from '@mui/material';

interface SupportPlanRingProps extends BoxProps {
  hasSupportPlan: boolean;
}

export function SupportPlanRing({
  hasSupportPlan,
  sx,
  ...props
}: SupportPlanRingProps) {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        ...(hasSupportPlan && {
          border: `3px solid ${palette.indigo[400]}`,
          borderRadius: '50%',
          backgroundColor: palette.background.paper,
          padding: 0.25,
        }),
        ...sx,
      }}
      {...props}
    />
  );
}
