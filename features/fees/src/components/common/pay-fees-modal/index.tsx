import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeFromUseStudentFees } from '../../../api/student-fees';
import { PayFeesStepTwo } from './step-two';
import { PayFeesSettingsProvider } from './store';
import { PayFeesStepOne } from './step-one';

interface PayFeesModalProps {
  open: boolean;
  onClose: () => void;
  feesToPay: NonNullable<ReturnTypeFromUseStudentFees>[];
}

export function PayFeesModal({ open, onClose, feesToPay }: PayFeesModalProps) {
  const { t } = useTranslation(['common', 'fees']);

  return (
    <PayFeesSettingsProvider open={open} onClose={onClose}>
      {({ step, nextAction, previousStep, disableConfirm, isSubmitting }) => (
        <Dialog
          open={open}
          onClose={onClose}
          scroll="paper"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle onClose={onClose}>
            {t('fees:makePayment', { count: feesToPay.length })}
          </DialogTitle>
          <DialogContent>
            {step === 0 && <PayFeesStepOne feesToPay={feesToPay} />}
            {step === 1 && <PayFeesStepTwo />}
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="inherit"
              onClick={step === 0 ? onClose : previousStep}
            >
              {step === 0
                ? t('common:actions.cancel')
                : t('common:actions.back')}
            </Button>

            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
              onClick={nextAction}
              disabled={disableConfirm}
            >
              {step === 0
                ? t('common:actions.next')
                : t('fees:completePayment')}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      )}
    </PayFeesSettingsProvider>
  );
}
