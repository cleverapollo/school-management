import { Box, Stack, Typography } from '@mui/material';
import { Search, SearchType } from '@tyro/api';
import { Avatar } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
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
      return `/people/contacts/${partyId}`;
    default:
      return `/groups/class`;
  }
}

export function PersonOption({
  option,
  endIcon,
}: {
  option: SearchOptionData;
  endIcon?: JSX.Element;
}) {
  const { partyId, type, text, avatarUrl } =
    option as PeopleSectionProps['people'][number];
  const [t] = useTranslation(['common']);

  return (
    <SearchOption path={getPersonPath(partyId, type)} optionData={option}>
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
            }}
          >
            <Avatar
              sx={{ width: 32, height: 32, fontSize: 14 }}
              name={text}
              src={avatarUrl}
            />
          </Box>
          <Stack>
            <Typography component="span" variant="body2">
              {text}
            </Typography>
            <Typography component="span" variant="caption">
              {t(`common:searchType.${type}`)}
            </Typography>
          </Stack>
        </Stack>
        {endIcon && <Box alignSelf="flex-end">{endIcon}</Box>}
      </Stack>
    </SearchOption>
  );
}

export function PeopleSection({ people }: PeopleSectionProps) {
  if (people.length === 0) return null;

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
