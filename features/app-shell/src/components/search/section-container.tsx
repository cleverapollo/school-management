import { Box, BoxProps, Typography } from '@mui/material';
import { useId } from 'react';

interface SectionContainerProps extends BoxProps {
  heading: string;
}

export function SectionContainer({
  heading,
  children,
  ...props
}: SectionContainerProps) {
  const groupId = useId();

  return (
    <Box component="li" role="presentation" sx={{ pt: 1.5 }} {...props}>
      <Typography
        id={`search-group-heading-${groupId}`}
        variant="subtitle2"
        component="span"
      >
        {heading}
      </Typography>
      <Box
        component="ul"
        role="group"
        aria-labelledby={`search-group-heading-${groupId}`}
        pt={1}
      >
        {children}
      </Box>
    </Box>
  );
}
