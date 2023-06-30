import {
  ListItem,
  ListItemAvatar,
  List,
  Tooltip,
  IconButton,
  ListItemText,
  Stack,
  useTheme,
  Box,
} from '@mui/material';
import { Control, useFieldArray } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Colour,
  EnrollmentIre_ChangeProgrammeStage,
  ReturnTypeProgrammeStage,
  useProgrammeStages,
} from '@tyro/api';
import { TrashIcon } from '@tyro/icons';
import { Avatar, RHFAutocomplete } from '@tyro/core';
import { useRef } from 'react';

export type StudentListFormState = {
  students: Array<{
    id: EnrollmentIre_ChangeProgrammeStage['studentPartyId'];
    name: string;
    programmeStage?: ReturnTypeProgrammeStage;
    avatarUrl?: string | null;
    avatarColor?: Colour | null;
  }>;
};

type StudentListProps<TField extends StudentListFormState> = {
  control: TField extends StudentListFormState ? Control<TField> : never;
};

export const StudentList = <TField extends StudentListFormState>({
  control,
}: StudentListProps<TField>) => {
  const { t } = useTranslation(['common', 'people']);
  const { spacing } = useTheme();
  const listContainerRef = useRef<HTMLDivElement>(null);

  const { data: programmeStagesData = [] } = useProgrammeStages();

  const { fields, remove } = useFieldArray({
    control,
    name: 'students',
  });

  const virtualizer = useVirtualizer({
    count: fields.length,
    getScrollElement: () => listContainerRef.current,
    estimateSize: () => 64,
    overscan: 4,
  });

  const virtualStudents = virtualizer.getVirtualItems();

  const disableRemoveButton = fields.length === 1;

  return (
    <Box
      ref={listContainerRef}
      sx={{
        maxHeight: spacing(40),
        overflowY: 'scroll',
        position: 'relative',
      }}
    >
      <List
        sx={{
          position: 'relative',
          height: virtualizer.getTotalSize(),
        }}
      >
        {virtualStudents.map((virtualRow) => {
          const { name, avatarUrl, programmeStage, avatarColor } =
            fields[virtualRow.index];

          return (
            <ListItem
              key={virtualRow.key}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              secondaryAction={
                <Tooltip
                  title={
                    disableRemoveButton
                      ? t('people:youMustHaveAtLeastOneStudent')
                      : t('common:actions.remove')
                  }
                >
                  <span>
                    <IconButton
                      aria-label={t('common:actions.remove')}
                      color="primary"
                      disabled={disableRemoveButton}
                      onClick={() => remove(virtualRow.index)}
                    >
                      <TrashIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              }
            >
              <ListItemAvatar>
                <Avatar
                  src={avatarUrl}
                  name={name}
                  sx={{
                    ...(avatarColor && {
                      bgcolor: `${avatarColor}.500`,
                    }),
                  }}
                />
              </ListItemAvatar>
              <Stack
                direction="row"
                gap={2}
                width="100%"
                alignItems="center"
                justifyContent="space-between"
              >
                <ListItemText primary={name} secondary={programmeStage?.name} />
                <RHFAutocomplete<StudentListFormState, ReturnTypeProgrammeStage>
                  label={t('common:programmeYear')}
                  optionIdKey="id"
                  optionTextKey="name"
                  controlProps={{
                    name: `students.${virtualRow.index}.programmeStage`,
                    control,
                  }}
                  sx={{ width: spacing(22), mr: 2 }}
                  options={programmeStagesData}
                  size="small"
                />
              </Stack>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
