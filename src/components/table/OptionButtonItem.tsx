import { ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import {useState} from 'react';
import { styled } from '@mui/material/styles'
import SvgIconStyle from '../SvgIconStyle';
import {Option} from './types';
import { useTranslation } from '@tyro/i18n';
import ConfirmationDialog, {ConfirmationDialogProps} from "../dialog/ConfimationDialog";

const NavItemSize = 24;

export const ListItemIconStyle = styled(ListItemIcon)({
    width: NavItemSize,
    height: NavItemSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': { width: '100%', height: '100%' },
});

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
    const { t } = useTranslation(['common']);
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
                {/* @ts-ignore */}
                <ListItemText id={`lable-${index}`} primary={t(option.text)} />
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
                {/* @ts-ignore */}
                <ListItemText id={`lable-${index}`} primary={t(`common:actions.${option.text}`)} />
            </ListItemButton>
        );
    }


}

export default OptionButtonItem;
