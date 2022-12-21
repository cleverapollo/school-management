import * as React from 'react';
import {useEffect, useId} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {LoadingButton} from "@mui/lab";

export interface ConfirmationDialogProps {
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    open?: boolean
    confirmFunction: () => Promise<any>
    cancelFunction?: () => void
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {

    const [open, setOpen] = React.useState(props.open || false);
    const [loading, setLoading] = React.useState( false);
    const arialId = useId()
    const ariaTitle = `${arialId}-title`
    const ariaDescription = `${arialId}-description`

    const handleClose = () => {
        props.cancelFunction ? props.cancelFunction() :
        setOpen(false);
    };

    const handleConfirm = () => {
        setLoading(true)
        props.confirmFunction()
            .then(r => setOpen(false))
            .catch(e =>  setOpen(false))
        ;
    };

    useEffect( () => {
        setOpen(props.open || false)
    }, [props.open])

    return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby={ariaTitle}
                aria-describedby={ariaDescription}
            >
                <DialogTitle id={ariaTitle}>
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id={ariaDescription}>
                        {props.description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <LoadingButton onClick={handleConfirm} autoFocus loading={loading} >
                        {props.confirmText || 'Agree'}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
    );
}