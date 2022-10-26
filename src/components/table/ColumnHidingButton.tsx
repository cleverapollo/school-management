import {
  IconButton,
  Popover,
  List,
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { Column } from '@tanstack/table-core';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { OPTIONS_COLUMN_NAME } from './constants';

interface IColumnHidingButtonProps<TData> {
  columns: Column<TData, unknown>[];
}

const ColumnHidingButton = <TData,>({ columns }: IColumnHidingButtonProps<TData>) => {
  const defaultValue: string[] = [];
  columns.forEach(column => {
    if(column.id !== OPTIONS_COLUMN_NAME) {
      defaultValue.push(column.id);
    }
  });

  const [checked, setChecked] = useState<string[]>([...defaultValue]);

  const handleToggle = (column: Column<TData, unknown>) => {
    if (!column.getCanHide()) {
      return;
    }
    const currentIndex = checked.indexOf(column.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(column.id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    column.toggleVisibility();
  };

  return (
  <PopupState variant="popover" popupId="popup-popover">
    {(popupState) => (
    <>
      <IconButton {...bindTrigger(popupState)}>
        <SettingsIcon />
      </IconButton>
      <Popover 
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List>
        {columns.map(column => {
          return column.columnDef.header?.toString() !== OPTIONS_COLUMN_NAME &&
            column.columnDef.header?.toString() &&
            <ListItem key={`list-${column.id}`} disablePadding>
              <ListItemButton role={undefined} onClick={() => handleToggle(column)} dense>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(column.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  disabled={!column.getCanHide()}
                  inputProps={{ 'aria-labelledby': `lable-${column.id}`}}
                />
                <ListItemText id={`lable-${column.id}`} primary={column.columnDef.header?.toString()} />
              </ListItemButton>
            </ListItem>
          })}
        </List>
      </Popover>
    </>)}
  </PopupState>
  );
}

export default ColumnHidingButton;
