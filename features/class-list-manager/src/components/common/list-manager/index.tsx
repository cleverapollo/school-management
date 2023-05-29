import { Box, Stack } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';
import { useContainerMargin } from '../../../hooks/use-container-margin';
import { GroupColumn } from './group-column';
import { useListManagerState, UseListManagerStateProps } from './state';
import { UnassignedColumn } from './unassigned-column';

interface ListManagerProps {
  unassignedStudents: UseListManagerStateProps['unassignedStudents'];
  groups: UseListManagerStateProps['groups'];
}

export function ListManager({ unassignedStudents, groups }: ListManagerProps) {
  const containerMargin = useContainerMargin();
  const { state, onDragStart, onDragEnd, cardProps } = useListManagerState({
    unassignedStudents,
    groups,
  });

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Box
        sx={{
          overflowY: 'hidden',
        }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            sx={{
              px: containerMargin,
            }}
          >
            {state.map((group) =>
              group.id === 'unassigned' ? (
                <UnassignedColumn
                  cardProps={cardProps}
                  key={group.id}
                  group={group}
                />
              ) : (
                <GroupColumn
                  cardProps={cardProps}
                  key={group.id}
                  group={group}
                />
              )
            )}
          </Stack>
        </Box>
      </Box>
    </DragDropContext>
  );
}
