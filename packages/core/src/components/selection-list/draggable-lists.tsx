import { Stack, List, ListItem, ListItemText, ListSubheader } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";

interface GroupedDraggableSelectionListProps<T extends object | string> {
  groups: {
    [groupName: string]: T[];
  },
  optionIdKey?: keyof T;
  getOptionLabel: (option: T) => string;
}


export const GroupedDraggableSelectionList = <T extends object | string>({ groups, optionIdKey, getOptionLabel }: GroupedDraggableSelectionListProps<T>) => {

  let indexAcrossGroups = 0;

  return (
    <List>
      {Object.entries(groups).map(([groupName, groupOptions], groupIndex) => (
        <>
          <Draggable draggableId={groupName} index={0}>
            {(provided, snapshot) => (
              <ListSubheader>{groupName}</ListSubheader>
            )}
          </Draggable>
          {groupOptions.map((option, index) => (
            <Draggable draggableId={groupName} index={0}>
              {(provided, snapshot) => (
                <ListItem key={typeof option === 'object' && optionIdKey ? option[optionIdKey] : JSON.stringify(option)}>
                  <ListItemText primary={getOptionLabel(option)} />
                </ListItem>
              )}
            </Draggable>
          ))}
        </>
      ))}
    </List>
  )
}