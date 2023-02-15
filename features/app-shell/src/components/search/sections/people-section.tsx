import { Box, Stack, Typography } from '@mui/material';
import { Search, SearchType } from '@tyro/api';
import { SearchOption } from '../option';
import { SearchOptionData } from '../provider';
import { SectionContainer } from '../section-container';

interface PeopleSectionProps {
  people: Search[];
}

function getPersonPath(partyId: number, type: SearchType) {
  switch (type) {
    case SearchType.Student:
      return `/people/students/${partyId}`;
    case SearchType.Staff:
      return `/people/staff/${partyId}`;
    case SearchType.Contact:
      return `/people/contact/${partyId}`;
    default:
      return `/dashboard`;
  }
}

export function PersonOption({
  option,
  endIcon,
}: {
  option: SearchOptionData;
  endIcon?: JSX.Element;
}) {
  const { partyId, type, text } =
    option as PeopleSectionProps['people'][number];

  return (
    <SearchOption path={getPersonPath(partyId, type)} optionData={option}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack>
          <Typography component="span" variant="body2">
            {text}
          </Typography>
        </Stack>
        {endIcon && <Box alignSelf="flex-end">{endIcon}</Box>}
      </Stack>
    </SearchOption>
  );
}

export function PeopleSection({ people }: PeopleSectionProps) {
  if (!people) return null;

  return (
    <SectionContainer heading="People">
      {people?.map((option) => (
        <PersonOption
          key={`${option.partyId}-${option.text}`}
          option={option}
        />
      ))}
    </SectionContainer>
  );
}
