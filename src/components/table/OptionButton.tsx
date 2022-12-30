import {
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { FC } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import PopupState, {bindTrigger, bindPopover, bindMenu} from 'material-ui-popup-state';
import SvgIconStyle from '../SvgIconStyle';
import { Option } from './types';
import { ListItemIconStyle } from '../nav-section/vertical/style';
import useLocales from '../../hooks/useLocales';
import OptionButtonItem from "./OptionButtonItem";


const getOptionsIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/options/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

interface IOptionButtonProps<Type> {
  options: Option<Type>[];
  row?: Type
}

const OptionButton = <T extends unknown>({options, row}: IOptionButtonProps<T>) => {
  const { translate } = useLocales();

  //ToDO: refactor option button for avoiding propagation with rowSelection
  return (
  <PopupState variant="popover" popupId="popup-popover">
    {(popupState) => (
    <>
      <IconButton onClick={(e) => {e.stopPropagation()}}>
        <MoreVert {...bindTrigger(popupState)}/>
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
        {options.map((option, index) => {
          return (
            <ListItem key={`list-${index}`} disablePadding sx={{ padding: '8px' }}  {...bindMenu(popupState)}>
                <OptionButtonItem option={option} index={index} row={row} closeFunc={popupState.close}/>
            </ListItem>
          )
          })}
        </List>
      </Popover>
    </>)}
  </PopupState>
  );
}

export default OptionButton;
