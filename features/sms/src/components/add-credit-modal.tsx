import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useFormatNumber, useTranslation } from '@tyro/i18n';
import { RHFSelect, useFormValidator } from '@tyro/core';
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import {
  ReturnTypeOfUseSmsXeroItems,
  useSmsXeroItems,
  useTopUpSms,
} from '../api/sms-credit';

interface AddCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredit: number;
}

interface AddCreditFormState {
  code: string;
}

export function AddCreditModal({
  isOpen,
  onClose,
  currentCredit,
}: AddCreditModalProps) {
  const { t } = useTranslation(['common', 'sms']);
  const { formatCurrency } = useFormatNumber();

  const { mutateAsync, isLoading: isSubmitting } = useTopUpSms();
  const { data: xeroItems } = useSmsXeroItems(isOpen);

  const { resolver, rules } = useFormValidator<AddCreditFormState>();
  const { control, handleSubmit, reset, watch } = useForm<AddCreditFormState>({
    resolver: resolver({
      code: rules.required(),
    }),
  });
  const selectedCode = watch('code');

  const summaryLines = useMemo(() => {
    const { cost } =
      xeroItems?.find((option) => option.code === selectedCode) ?? {};
    return {
      [t('sms:currentAvailableBudget')]: formatCurrency(currentCredit),
      [t('sms:newAvailableBudget')]: formatCurrency(
        currentCredit + (cost ?? 0)
      ),
    };
  }, [t, formatCurrency, currentCredit, selectedCode]);

  const onSubmit = ({ code }: AddCreditFormState) => {
    const { cost } =
      xeroItems?.find((option) => option.code === selectedCode) ?? {};

    mutateAsync({
      code,
      amount: cost ?? 0,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('sms:addSmsCredit')}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 3, pb: 0 }}>
          <RHFSelect<AddCreditFormState, ReturnTypeOfUseSmsXeroItems>
            fullWidth
            options={xeroItems ?? []}
            label={t('sms:topUpAmount')}
            getOptionLabel={(option) =>
              formatCurrency(option?.cost ?? 0, { maximumFractionDigits: 0 })
            }
            optionIdKey="code"
            controlProps={{
              name: 'code',
              control,
            }}
          />

          <Stack
            component="dl"
            sx={{
              m: 0,
            }}
          >
            {Object.entries(summaryLines).map(([title, value]) => (
              <Stack direction="row" justifyContent="space-between" key={title}>
                <Typography
                  component="dt"
                  variant="body2"
                  sx={{ color: 'text.secondary' }}
                >
                  {title}
                </Typography>
                <Typography component="dd" variant="body2">
                  {value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {t('common:actions.cancel')}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('sms:addCredit')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
