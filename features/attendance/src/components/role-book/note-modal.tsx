import { Button, TextField } from '@mui/material';
import {
  AgGridReact,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@tyro/core';
import { RefObject, useEffect, useState } from 'react';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeFromSessionAttendance } from '../../api/session-attendance';

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  tableRef: RefObject<AgGridReact<ReturnTypeFromSessionAttendance> | null>;
  noteRowAndKey: { rowId: string; noteKey: string } | null;
}

export function NoteModal({
  open,
  onClose,
  tableRef,
  noteRowAndKey,
}: NoteModalProps) {
  const { t } = useTranslation(['common', 'attendance']);
  const [note, setNote] = useState('');
  const [hasNote, setHasNote] = useState(false);

  const getRowNode = () =>
    noteRowAndKey && tableRef?.current?.api
      ? tableRef.current.api.getRowNode(noteRowAndKey.rowId)
      : null;

  const onSave = () => {
    const rowNode = getRowNode();

    if (rowNode?.data && noteRowAndKey) {
      rowNode.setDataValue(`noteByKey.${noteRowAndKey.noteKey}`, note || null);
    }
    onClose();
  };

  useEffect(() => {
    const rowNode = getRowNode();

    if (rowNode && noteRowAndKey) {
      const noteValue = rowNode?.data?.noteByKey[noteRowAndKey.noteKey] ?? '';
      setNote(noteValue);
      setHasNote(!!noteValue);
    } else {
      setNote('');
      setHasNote(false);
    }
  }, [noteRowAndKey]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle onClose={onClose}>
        {hasNote ? t('attendance:editNote') : t('attendance:addNote')}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label={t('attendance:note')}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>
        <Button variant="soft" onClick={onSave}>
          {t('common:actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
