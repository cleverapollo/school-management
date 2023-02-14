import { Box, Stack, Typography } from '@mui/material';
import Fuse from 'fuse.js';
import { SearchOption } from '../option';
import { SectionContainer } from '../section-container';

interface PageSectionProps {
  pages: Fuse.FuseResult<{
    title: string;
    path: string;
    icon: JSX.Element;
    breadcrumbs: string[];
  }>[];
}

export function PagesSection({ pages }: PageSectionProps) {
  if (!pages || pages.length === 0) return null;

  return (
    <SectionContainer heading="Pages">
      {pages.map(({ item: { title, path, icon, breadcrumbs } }) => (
        <SearchOption key={path} path={path}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              {icon}
            </Box>
            <Stack>
              <Typography component="span" variant="body2">
                {title}
              </Typography>
              <Typography component="span" variant="caption">
                {breadcrumbs.join(' > ')}
              </Typography>
            </Stack>
          </Stack>
        </SearchOption>
      ))}
    </SectionContainer>
  );
}
