import { Box, Stack, Typography } from '@mui/material';
import { SearchOption } from '../option';
import { SearchOptionData } from '../provider';
import { SectionContainer } from '../section-container';

interface PageSectionProps {
  pages: {
    partyId: string;
    type: 'PAGE';
    text: string;
    meta: {
      path: string;
      icon: JSX.Element;
      breadcrumbs: string[];
    };
  }[];
}

export function PageOption({
  option,
  endIcon,
}: {
  option: SearchOptionData;
  endIcon?: JSX.Element;
}) {
  const {
    partyId,
    text,
    meta: { path, icon, breadcrumbs },
  } = option as PageSectionProps['pages'][number];

  return (
    <SearchOption
      key={partyId}
      path={path}
      optionData={{ ...option, meta: { path, breadcrumbs } }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
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
              {text}
            </Typography>
            <Typography component="span" variant="caption">
              {breadcrumbs.join(' > ')}
            </Typography>
          </Stack>
        </Stack>
        {endIcon}
      </Stack>
    </SearchOption>
  );
}

export function PagesSection({ pages }: PageSectionProps) {
  if (!pages || pages.length === 0) return null;

  return (
    <SectionContainer heading="Pages">
      {pages.map((option) => (
        <PageOption key={option.partyId} option={option} />
      ))}
    </SectionContainer>
  );
}
