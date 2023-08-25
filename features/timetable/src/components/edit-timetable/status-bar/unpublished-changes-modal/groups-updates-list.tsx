import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import {
  Avatar,
  ReturnTypeDisplayNames,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { UndoIcon } from '@tyro/icons';
import { useMemo } from 'react';
import { useTtResetChanges } from '../../../../api/edit-timetable/reset-changes';
import { ReturnTypeFromUseUnpublishedTimetableChanges } from '../../../../api/edit-timetable/unpublished-timetable-changes';
import { ListHeader } from './list-header';
import { NoChangesPlaceholder } from './no-changes-placeholder';

interface GroupUpdatesListProps {
  timetableId: number;
  groupDiffs: ReturnTypeFromUseUnpublishedTimetableChanges['groupDiffs'];
}

function getGroupName({
  newGroup,
  oldGroup,
}: ReturnTypeFromUseUnpublishedTimetableChanges['groupDiffs'][number]) {
  const group = oldGroup ?? newGroup;

  return group.partyGroup?.name ?? '';
}

function getChangeList(
  t: TFunction<
    ('common' | 'timetable')[],
    undefined,
    ('common' | 'timetable')[]
  >,
  displayNames: ReturnTypeDisplayNames,
  groupDiff: ReturnTypeFromUseUnpublishedTimetableChanges['groupDiffs'][number]
) {
  const changes: string[] = [];
  const { oldGroup, newGroup } = groupDiff;

  if (groupDiff.teachersChanged) {
    const oldTeachers =
      oldGroup?.teachers?.length > 0
        ? displayNames(
            oldGroup.teachers.map(({ person }) => person),
            ' & '
          )
        : '-';
    const newTeachers =
      newGroup?.teachers?.length > 0
        ? displayNames(
            newGroup.teachers.map(({ person }) => person),
            ' & '
          )
        : '-';
    changes.push(
      `${t('common:teachers')}: ${oldTeachers} → ${newTeachers ?? '-'}`
    );
  }

  return changes;
}

export function GroupUpdatesList({
  timetableId,
  groupDiffs,
}: GroupUpdatesListProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const { displayNames } = usePreferredNameLayout();
  const { mutateAsync: resetChanges } = useTtResetChanges();

  const sortedDiffs = useMemo(
    () =>
      groupDiffs.sort((diffA, diffB) =>
        getGroupName(diffA).localeCompare(getGroupName(diffB))
      ),
    [t, groupDiffs]
  );

  return (
    <Box>
      <ListHeader variant="subtitle1">{t('timetable:groupUpdates')}</ListHeader>
      {sortedDiffs.length > 0 ? (
        <Stack
          component="ul"
          sx={{
            m: 0,
            px: 1,
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
          {sortedDiffs.map((groupDiff) => {
            const { newGroup, oldGroup } = groupDiff;
            const lessonAlwaysWithValues = newGroup ?? oldGroup ?? {};
            const id = lessonAlwaysWithValues.partyId;
            const changeList = getChangeList(t, displayNames, groupDiff);
            const { partyGroup } = lessonAlwaysWithValues;

            const subject =
              partyGroup?.__typename === 'SubjectGroup'
                ? partyGroup?.subjects?.[0]
                : { colour: 'default' };

            const bgColorStyle = subject?.colour
              ? { bgcolor: `${subject.colour}.500` }
              : {};

            return (
              <Stack
                component="li"
                direction="row"
                key={id}
                spacing={1}
                alignItems="center"
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: 1.5,
                  justifyContent: 'space-between',
                }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    name={partyGroup?.name}
                    src={partyGroup?.avatarUrl}
                    sx={{
                      mr: 1,
                      borderRadius: 1,
                      ...bgColorStyle,
                    }}
                  />
                  <Stack>
                    <Typography variant="subtitle2" color="text.primary">
                      {partyGroup?.name}
                    </Typography>
                    {changeList.map((change) => (
                      <Typography
                        key={change}
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {change}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
                <Tooltip title={t('common:actions.undo')}>
                  <IconButton
                    aria-label={t('common:actions.undo')}
                    onClick={() =>
                      resetChanges({
                        timetableId,
                        groups: [
                          {
                            timetableGroupPartyId: id,
                          },
                        ],
                      })
                    }
                    color="primary"
                  >
                    <UndoIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          })}
        </Stack>
      ) : (
        <NoChangesPlaceholder />
      )}
    </Box>
  );
}
