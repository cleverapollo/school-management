import { Box, Stack, Theme, Typography, useTheme } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import { useTranslation } from '@tyro/i18n';
import { SearchInput, usePreferredNameLayout } from '@tyro/core';
import { useState, useMemo } from 'react';
import { DraggableCard } from './draggable-card';
import { EmptyGroupPlaceholder } from './empty-group-placeholder';
import { ListManagerState } from './state/types';
import { ReturnTypeOfUseListManagerState } from './state';

const getListStyle = ({ customShadows }: Theme, isDraggingOver: boolean) =>
  ({
    backgroundColor: isDraggingOver ? 'indigo.200' : 'background.paper',
    boxShadow: customShadows.card,
    borderRadius: 2,
    paddingY: 1,
    paddingX: 2,
  } as const);

interface UnassignedColumnProps {
  group: ListManagerState;
  cardProps: ReturnTypeOfUseListManagerState['cardProps'];
  enableDuplicateStudents?: boolean;
}

export function UnassignedColumn({
  group,
  cardProps,
  enableDuplicateStudents,
}: UnassignedColumnProps) {
  const theme = useTheme();
  const { t } = useTranslation(['common', 'classListManager']);
  const { displayName } = usePreferredNameLayout();
  const [search, setSearch] = useState('');

  const filteredGroup = useMemo(() => {
    if (!group?.students) return [];
    if (!search)
      return group?.students?.map((student, index) => ({ student, index }));

    const lowerCaseSearch = search.toLowerCase();
    return group?.students
      ?.map((student, index) => ({ student, index }))
      ?.filter(({ student }) => {
        const name = displayName(student?.person);
        return name.toLowerCase().includes(lowerCaseSearch);
      });
  }, [search, group?.students]);

  const showNoSearchResults = search.length > 0 && filteredGroup.length === 0;
  const showEmptyGroupPlaceholder =
    !showNoSearchResults && group?.students?.length === 0;

  return (
    <Droppable key={group.id} droppableId={`${group.id}`} type="group">
      {(provided, snapshot) => (
        <Box sx={getListStyle(theme, snapshot.isDraggingOver)}>
          <Box sx={{ width: theme.spacing(30) }}>
            <Stack sx={{ p: 2, pb: 0 }}>
              <Typography component="h2" variant="h6">
                {t('classListManager:unassignedStudents')}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.secondary' }}
              >
                {t('classListManager:youHaveXUnassignedStudents', {
                  count: group?.students?.length ?? 0,
                })}
              </Typography>
            </Stack>
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              containerProps={{ sx: { my: 1 } }}
            />
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {filteredGroup?.map(({ student, index }) => (
                <DraggableCard
                  key={student.id}
                  index={index}
                  student={student}
                  groupId={group.id}
                  enableDuplicateStudents={enableDuplicateStudents}
                  {...cardProps}
                />
              ))}
              {showNoSearchResults && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 2.5,
                    mb: 1,
                    border: '1px solid transparent',
                  }}
                >
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.secondary' }}
                  >
                    {t('common:noResultsFound')}
                  </Typography>
                </Box>
              )}

              {showEmptyGroupPlaceholder && (
                <EmptyGroupPlaceholder
                  sx={{
                    borderColor: snapshot.isDraggingOver
                      ? 'indigo.500'
                      : 'slate.400',
                  }}
                />
              )}

              <Box
                sx={{
                  display:
                    !showNoSearchResults && !showEmptyGroupPlaceholder
                      ? 'block'
                      : 'none',
                }}
              >
                {provided.placeholder}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Droppable>
  );
}
