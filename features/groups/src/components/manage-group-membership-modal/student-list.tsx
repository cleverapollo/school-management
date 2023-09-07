import { IconButton, Stack, SvgIconProps, Tooltip } from '@mui/material';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { CloseIcon, UndoIcon } from '@tyro/icons';
import {
  StudentAutocomplete,
  StudentsSelectOption,
  useStudentsForSelect,
} from '@tyro/people';

export function StudentListContainer({
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

interface StudentListItemsProps {
  children: React.ReactNode;
  onRemove: (partyId: StudentsSelectOption[number]) => void;
  undoIcon: boolean;
  student: StudentsSelectOption[number];
}

export function StudentListItems({
  children,
  onRemove,
  student,
  undoIcon,
}: StudentListItemsProps) {
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
        src={student?.avatarUrl}
        name={displayName(student)}
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
          onClick={() => onRemove(student)}
          color="primary"
        >
          {undoIcon ? <UndoIcon /> :  <CloseIcon />}
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
