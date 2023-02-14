import { Stack, Typography } from '@mui/material';
import { SearchType } from '@tyro/api';
import { SearchOption } from '../option';
import { SectionContainer } from '../section-container';

interface PeopleSectionProps {
  people:
    | Array<{
        partyId: number;
        type: SearchType;
        text: string;
      }>
    | undefined
    | null;
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

export function PeopleSection({ people }: PeopleSectionProps) {
  if (!people) return null;

  return (
    <SectionContainer heading="People">
      {people?.map(({ partyId, type, text }) => (
        <SearchOption
          key={`${partyId}-${text}`}
          path={getPersonPath(partyId, type)}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Stack>
              <Typography component="span" variant="body2">
                {text}
              </Typography>
            </Stack>
          </Stack>
        </SearchOption>
      ))}
    </SectionContainer>
  );
}
