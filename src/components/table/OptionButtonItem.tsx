import {ListItemButton, ListItemText,} from '@mui/material';
import * as React from 'react';
import {useState} from 'react';
import SvgIconStyle from '../SvgIconStyle';
import {Option} from './types';
import {ListItemIconStyle} from '../nav-section/vertical/style';
import useLocales from '../../hooks/useLocales';
import ConfirmationDialog, { ConfirmationDialogProps } from "../dialog/ConfimationDialog";


const getOptionsIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/options/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

interface IOptionButtonItemProps<Type> {
  option: Option<Type>;
  row?: Type
  index: number,
    closeFunc: () => void
}

const OptionButtonItem = <T extends unknown>({option, row, index, closeFunc}: IOptionButtonItemProps<T>) => {
  const { translate } = useLocales();
    const [modalShown, setModalShown] = useState(false);

    const handleOnClick = (e : any) =>{
        if(option.confirmationDialog != null){
            setModalShown(true)
        }

    }

    if (option.confirmationDialog) {
        const confirmation = option.confirmationDialog(row as T)
        const combinedFunc = () => {
            return confirmation.confirmFunction().then(() => closeFunc)
        }

        return (
            <ListItemButton onClick={handleOnClick} dense>
                <ListItemIconStyle>{getOptionsIcon(option.icon)}</ListItemIconStyle>
                <ListItemText id={`lable-${index}`} primary={translate(option.text)} />
                {confirmation.title !== '' && <ConfirmationDialog  open={modalShown}
                                                                   title={confirmation.title}
                                                                   description={confirmation.description} confirmText={confirmation.confirmText}
                                                                   confirmFunction={combinedFunc} cancelFunction={closeFunc}
                />
                }
            </ListItemButton>
        );
    } else {
        return (
            <ListItemButton onClick={(e) => {option.action(e); closeFunc();}}  dense>
                <ListItemIconStyle>{getOptionsIcon(option.icon)}</ListItemIconStyle>
                <ListItemText id={`lable-${index}`} primary={translate(option.text)} />
            </ListItemButton>
        );
    }


}

export default OptionButtonItem;
