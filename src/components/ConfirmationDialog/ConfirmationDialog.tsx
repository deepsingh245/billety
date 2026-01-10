import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmationDialogProps {
    open: boolean;
    title: string;
    content: string;
    onConfirm: () => void;
    onClose: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmationDialog({
    open,
    title,
    content,
    onConfirm,
    onClose,
    confirmText = "Confirm",
    cancelText = "Cancel",
}: ConfirmationDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                sx: {
                    backgroundColor: 'background.paper',
                    backgroundImage: 'none',
                }
            }}
        >
            <DialogTitle id="alert-dialog-title" sx={{ color: 'text.primary' }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ color: 'text.secondary' }}>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' sx={{ color: 'text.primary' }} onClick={onClose}>{cancelText}</Button>
                <Button variant='contained' sx={{ color: 'white' }} onClick={onConfirm} autoFocus color="error">
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
