import { IconButton, Stack, Tooltip } from '@mui/material';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { CloseIcon } from '@tyro/icons';
import { Person } from '@tyro/api';

export function SiblingListContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack
      component="ul"
      sx={{
        mx: 0,
        my: 1,
        px: 0,
        '@media (hover: hover) and (pointer: fine)': {
          '& li button': {
            opacity: 0,
          },

          '& li:focus-within, & li:hover': {
            bgcolor: 'primary.lighter',

            '& button': {
              opacity: 1,
            },
          },
        },
      }}
    >
      {children}
    </Stack>
  );
}

interface SiblingListItemProps {
  children: React.ReactNode;
  onRemove: (partyId: number) => void;
  person: Person;
}

export function SiblingListItem({
  children,
  onRemove,
  person,
}: SiblingListItemProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const { displayName } = usePreferredNameLayout();

  return (
    <Stack
      component="li"
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        py: 1,
        px: 2,
        borderRadius: 1.5,
        justifyContent: 'space-between',
      }}
    >
      <Avatar
        src={person?.avatarUrl}
        name={displayName(person)}
        sx={{
          my: 1,
          mr: 0.5,
        }}
      />
      <Stack alignItems="flex-start" flex="1">
        {children}
      </Stack>
      <Tooltip title={t('common:actions.remove')}>
        <IconButton
          aria-label={t('common:actions.remove')}
          onClick={() => onRemove(person.partyId)}
          color="primary"
        >
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
