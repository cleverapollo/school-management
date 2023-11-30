import { useMemo } from 'react';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { PaymentMethod, PaymentStatus } from '@tyro/api';
import { ReturnTypeFromUseStudentFees } from '../../../api/student-fees';
import { PayFeesStepTwo } from './step-two';

interface PayFeesModalProps {
  open: boolean;
  onClose: () => void;
  feesToPay: NonNullable<ReturnTypeFromUseStudentFees>[];
}

export function PayFeesModal({ open, onClose, feesToPay }: PayFeesModalProps) {
  const { t } = useTranslation(['common', 'fees']);

  const paymentInput = useMemo(
    () => ({
      paymentAmounts: feesToPay.map(({ id, amount, person }) => ({
        feeId: id,
        amount,
        studentPartyId: person.partyId,
      })),
      paymentMethod: PaymentMethod.Card,
      paymentStatus: PaymentStatus.Created,
    }),
    [feesToPay]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle onClose={onClose}>Pay fees</DialogTitle>
      <DialogContent>
        <PayFeesStepTwo paymentInput={paymentInput} />
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>

        <LoadingButton type="submit" variant="contained">
          {t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
