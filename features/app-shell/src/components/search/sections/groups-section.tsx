import { Box, Stack, Typography } from '@mui/material';
import { Search, SearchType } from '@tyro/api';
import { Avatar } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { SearchOption } from '../option';
import { SearchOptionData } from '../provider';
import { SectionContainer } from '../section-container';

interface GroupsSectionProps {
  groups: Search[];
}

function getGroupPath(partyId: number, type: SearchType) {
  switch (type) {
    case SearchType.SubjectGroup:
      return `/groups/subject/${partyId}`;
    case SearchType.GeneralGroup:
      return `/groups/class/${partyId}`;
    // Need extra context through the meta to know if it's class or custom
    // case SearchType.GeneralGroup:
    //   return `/people/custom/${partyId}`;
    default:
      return `/groups/class`;
  }
}

export function GroupOption({
  option,
  endIcon,
}: {
  option: SearchOptionData;
  endIcon?: JSX.Element;
}) {
  const { partyId, type, text, avatarUrl } =
    option as GroupsSectionProps['groups'][number];
  const { t } = useTranslation(['common']);

  return (
    <SearchOption path={getGroupPath(partyId, type)} optionData={option}>
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

export function GroupsSection({ groups }: GroupsSectionProps) {
  if (groups.length === 0) return null;

  return (
    <SectionContainer heading="Groups">
      {groups?.map((option) => (
        <GroupOption key={`${option.partyId}-${option.text}`} option={option} />
      ))}
    </SectionContainer>
  );
}
