import { Box, Stack, Typography, useTheme } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import { useTranslation } from '@tyro/i18n';
import { DraggableCard } from './draggable-card';
import { EmptyGroupPlaceholder } from './empty-group-placeholder';
import { TeacherCards } from './teacher-cards';
import { ListManagerState } from './state/types';

const getListStyle = (isDraggingOver: boolean) =>
  ({
    backgroundColor: isDraggingOver ? 'indigo.200' : 'slate.200',
    borderColor: isDraggingOver ? 'indigo.100' : 'slate.100',
    borderRadius: 2,
    paddingY: 0.75,
    paddingX: 1.5,
  } as const);

interface GroupColumnProps {
  group: ListManagerState;
}

export function GroupColumn({ group }: GroupColumnProps) {
  const { t } = useTranslation(['common']);
  const { spacing } = useTheme();
  const showEmptyGroupPlaceholder = group?.students?.length === 0;

  return (
    <Droppable key={group.id} droppableId={`${group.id}`} type="group">
      {(provided, snapshot) => (
        <Box sx={getListStyle(snapshot.isDraggingOver)}>
          <Box sx={{ width: spacing(22) }}>
            <Stack sx={{ p: 1.5 }}>
              <Typography
                component="h2"
                variant="h6"
                sx={{ fontSize: '0.875rem !important' }}
              >
                {group.name}
              </Typography>
              <Typography component="span" variant="caption">
                {t('common:numOfMembers', {
                  count: group?.students?.length ?? 0,
                })}
              </Typography>
            </Stack>
            <TeacherCards
              teachers={group?.staff}
              isDraggingOver={snapshot.isDraggingOver}
            />
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {group?.students?.map((student, index) => (
                <DraggableCard
                  key={student.id}
                  index={index}
                  student={student}
                  groupId={group.id}
                />
              ))}
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
                  display: showEmptyGroupPlaceholder ? 'none' : 'block',
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
