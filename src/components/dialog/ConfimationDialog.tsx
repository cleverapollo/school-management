import * as React from 'react';
import {useEffect} from 'react';
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
    setData? (d: boolean): void
    confirmFunction: () => Promise<void>
    cancelFunction?: () => void
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
    useEffect( () => {
        setOpen(props.open || false)
    }, [props.open])
    const [open, setOpen] = React.useState(props.open || false);
    const [loading, setLoading] = React.useState( false);



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


    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
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
        </div>
    );
}
