import { Box, Stack, useTheme } from '@mui/material';
import { useBreakpointValue } from '@tyro/core';
import { DragDropContext } from 'react-beautiful-dnd';
import { useContainerMargin } from '../../../hooks/use-container-margin';
import { BulkEditSaveBar } from './bulk-edit-save-bar';
import { GroupColumn } from './group-column';
import { useListManagerState, UseListManagerStateProps } from './state';
import { UnassignedColumn } from './unassigned-column';

interface ListManagerProps {
  unassignedStudents: UseListManagerStateProps['unassignedStudents'];
  groups: UseListManagerStateProps['groups'];
  onBulkSave: UseListManagerStateProps['onBulkSave'];
}

function ListEndSpacer() {
  const { spacing } = useTheme();
  const space = useBreakpointValue({ sm: 1, lg: 3 });
  const spaceValue = space ? spacing(space) : '1px';

  return (
    <Box>
      <Box sx={{ width: spaceValue, height: spaceValue }} />
    </Box>
  );
}

export function ListManager({
  unassignedStudents,
  groups,
  onBulkSave,
}: ListManagerProps) {
  const containerMargin = useContainerMargin();
  const { state, onDragStart, onDragEnd, cardProps, editedState } =
    useListManagerState({
      unassignedStudents,
      groups,
      onBulkSave,
    });

  return (
    <>
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
              <ListEndSpacer />
            </Stack>
          </Box>
        </Box>
      </DragDropContext>
      <BulkEditSaveBar {...editedState} />
    </>
  );
}
