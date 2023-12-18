import {
  Stack,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { Fragment } from 'react';
import { Draggable } from 'react-beautiful-dnd';

interface GroupedDraggableSelectionListProps<T extends object | string> {
  groups: {
    [groupName: string]: T[];
  };
  getOptionLabel: (option: T) => string;
}

export const GroupedDraggableSelectionList = <T extends object | string>({
  groups,
  getOptionLabel,
}: GroupedDraggableSelectionListProps<T>) => {
  let indexAcrossGroups = 0;

  return (
    <List>
      {Object.entries(groups).map(([groupName, groupOptions], groupIndex) => {
        if (groupIndex > 0) {
          indexAcrossGroups += 1;
        }

        return (
          <Fragment key={groupName}>
            <Draggable draggableId={groupName} index={indexAcrossGroups}>
              {(provided, snapshot) => (
                <ListSubheader
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {groupName}
                </ListSubheader>
              )}
            </Draggable>
            {groupOptions.map((option) => {
              indexAcrossGroups += 1;

              return (
                <Draggable draggableId={groupName} index={indexAcrossGroups}>
                  {(provided, snapshot) => (
                    <ListItem
                      key={JSON.stringify(option)}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ListItemText primary={getOptionLabel(option)} />
                    </ListItem>
                  )}
                </Draggable>
              );
            })}
          </Fragment>
        );
      })}
    </List>
  );
};
