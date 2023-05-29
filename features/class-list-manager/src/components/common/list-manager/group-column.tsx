import { Box, Stack, Typography, useTheme } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import { useTranslation } from '@tyro/i18n';
import { DraggableCard } from './draggable-card';
import { EmptyGroupPlaceholder } from './empty-group-placeholder';
import { TeacherCards } from './teacher-cards';
import { ListManagerState } from './state/types';
import { ReturnTypeOfUseListManagerState } from './state';

const getListStyle = (isDraggingOver: boolean) =>
  ({
    backgroundColor: isDraggingOver ? 'indigo.200' : 'slate.200',
    borderColor: isDraggingOver ? 'indigo.100' : 'slate.100',
    borderRadius: 2,
    paddingY: 1,
    paddingX: 2,
  } as const);

interface GroupColumnProps {
  group: ListManagerState;
  cardProps: ReturnTypeOfUseListManagerState['cardProps'];
}

export function GroupColumn({ group, cardProps }: GroupColumnProps) {
  const { t } = useTranslation(['common']);
  const { spacing } = useTheme();

  return (
    <Droppable key={group.id} droppableId={`${group.id}`} type="group">
      {(provided, snapshot) => (
        <Box sx={getListStyle(snapshot.isDraggingOver)}>
          <Box sx={{ width: spacing(30) }}>
            <Stack sx={{ p: 2 }}>
              <Typography component="h2" variant="h6">
                {group.name}
              </Typography>
              <Typography component="span" variant="subtitle1">
                {t('common:numOfMembers', {
                  count: group?.students?.length ?? 0,
                })}
              </Typography>
            </Stack>
            {/* <TeacherCards
              teachers={group?.staff}
              isDraggingOver={snapshot.isDraggingOver}
            /> */}
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {group?.students?.map((student, index) => (
                <DraggableCard
                  key={student.id}
                  index={index}
                  student={student}
                  groupId={group.id}
                  {...cardProps}
                />
              ))}
              {group?.students?.length === 0 ? (
                <EmptyGroupPlaceholder
                  sx={{
                    borderColor: snapshot.isDraggingOver
                      ? 'indigo.500'
                      : 'slate.400',
                  }}
                />
              ) : (
                provided.placeholder
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Droppable>
  );
}
