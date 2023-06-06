import { Box, Stack, useTheme } from '@mui/material';
import { useBreakpointValue } from '@tyro/core';
import { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useContainerMargin } from '../../../hooks/use-container-margin';
import { BulkEditSaveBar } from './bulk-edit-save-bar';
import { GroupColumn } from './group-column';
import { NavConfirmDialog } from './nav-confirm-dialog';
import { useListManagerState, UseListManagerStateProps } from './state';
import { UnassignedColumn } from './unassigned-column';

interface ListManagerProps {
  listKey: string;
  unassignedStudents: UseListManagerStateProps['unassignedStudents'];
  groups: UseListManagerStateProps['groups'];
  onBulkSave: UseListManagerStateProps['onBulkSave'];
  enableDuplicateStudents?: boolean;
  onIsDirtyChange?: (isDirty: boolean) => void;
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
  listKey,
  unassignedStudents,
  groups,
  onBulkSave,
  enableDuplicateStudents = false,
  onIsDirtyChange,
}: ListManagerProps) {
  const containerMargin = useContainerMargin();
  const { state, onDragStart, onDragEnd, cardProps, editedState } =
    useListManagerState({
      listKey,
      unassignedStudents,
      groups,
      onBulkSave,
    });

  useEffect(() => {
    onIsDirtyChange?.(editedState.isEditing);
  }, [editedState.isEditing, onIsDirtyChange]);

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
                    enableDuplicateStudents={enableDuplicateStudents}
                  />
                ) : (
                  <GroupColumn
                    cardProps={cardProps}
                    key={group.id}
                    group={group}
                    enableDuplicateStudents={enableDuplicateStudents}
                  />
                )
              )}
              <ListEndSpacer />
            </Stack>
          </Box>
        </Box>
      </DragDropContext>
      <BulkEditSaveBar {...editedState} />
      <NavConfirmDialog isDirty={editedState.isEditing} />
    </>
  );
}