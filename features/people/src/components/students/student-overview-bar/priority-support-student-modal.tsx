import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface PrioritySupportStudentModalProps {
  id: string;
  open: boolean;
  onClose: () => void;
  studentId: number;
  studentName: string;
}

export function PrioritySupportStudentModal({
  id,
  open,
  onClose,
  studentId,
  studentName,
}: PrioritySupportStudentModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      id={id}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      <DialogTitle id={`${id}-title`}>
        Prioity note and active support plan for {studentName}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id={`${id}-description`}>
          Still to be designed
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
