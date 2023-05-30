import { Stack, StackProps, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation, useFormatNumber } from '@tyro/i18n';
import { BYTE_SIZE_PER_SMS, getByteSize } from '../../utils/byte-size';

interface SmsSummaryProps extends StackProps<'dl'> {
  message: string;
  costPerSms: number;
  totalCost: number;
}

export function SmsSummary({
  message,
  costPerSms,
  totalCost,
  ...props
}: SmsSummaryProps) {
  const { t } = useTranslation(['sms']);
  const { formatCurrency } = useFormatNumber();

  const summaryLines = useMemo(() => {
    const messageByteSize = getByteSize(message);
    const numberOfSms = Math.ceil(messageByteSize / BYTE_SIZE_PER_SMS);

    return {
      [t('sms:numberOfSms', { count: numberOfSms })]: t(
        'sms:numberOfCharacters',
        { count: messageByteSize }
      ),
      [t('sms:costPerSms')]: formatCurrency(costPerSms),
      [t('sms:totalCost')]: formatCurrency(totalCost),
    };
  }, [t, formatCurrency, message, costPerSms, totalCost]);

  return (
    <Stack
      component="dl"
      {...props}
      sx={{
        m: 0,
        ...props.sx,
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
  );
}
