import { Box, Stack, useTheme } from '@mui/material';
import { useBreakpointValue } from '@tyro/core';
import { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useContainerMargin } from '../../../hooks/use-container-margin';
import { BulkEditSaveBar } from './bulk-edit-save-bar';
import { GroupColumn } from './group-column';
import { NavConfirmDialog } from './nav-confirm-dialog';
import {
  ListManagerProvider,
  useListManagerState,
  UseListManagerStateProps,
} from './state';
import { UnassignedColumn } from './unassigned-column';

interface ListManagerProps {
  listKey: string;
  unassignedStudents: UseListManagerStateProps['unassignedStudents'];
  groups: UseListManagerStateProps['groups'];
  onBulkSave: UseListManagerStateProps['onBulkSave'];
  enableDuplicateStudents?: boolean;
  includeClassGroupName?: boolean;
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

export function ListManagerInner({
  onIsDirtyChange,
}: Pick<ListManagerProps, 'onIsDirtyChange'>) {
  const containerMargin = useContainerMargin();
  const { state, onDragStart, onDragEnd, editedState } = useListManagerState();

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
              spacing={1.5}
              alignItems="flex-start"
              sx={{
                px: containerMargin,
              }}
            >
              {state.map((group) =>
                group.id === 'unassigned' ? (
                  <UnassignedColumn key={group.id} group={group} />
                ) : (
                  <GroupColumn key={group.id} group={group} />
                )
              )}
              <ListEndSpacer />
            </Stack>
          </Box>
        </Box>
      </DragDropContext>
      <BulkEditSaveBar />
      <NavConfirmDialog isDirty={editedState.isEditing} />
    </>
  );
}

export function ListManager({
  listKey,
  unassignedStudents,
  groups,
  onBulkSave,
  enableDuplicateStudents = false,
  includeClassGroupName = false,
  onIsDirtyChange,
}: ListManagerProps) {
  return (
    <ListManagerProvider
      listKey={listKey}
      unassignedStudents={unassignedStudents}
      groups={groups}
      onBulkSave={onBulkSave}
      enableDuplicateStudents={enableDuplicateStudents}
      includeClassGroupName={includeClassGroupName}
    >
      <ListManagerInner onIsDirtyChange={onIsDirtyChange} />
    </ListManagerProvider>
  );
}
