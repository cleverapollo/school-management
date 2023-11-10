import { useTranslation } from '@tyro/i18n';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Dayjs } from 'dayjs';
import {
  getPrintSubstitution,
  usePrintSubstitution,
} from '../../api/print-substitution';

export interface CoverPrintFormProps {
  staffPartyIds: number[];
  fromDate: Dayjs;
  toDate: Dayjs;
}

export function CoverPrintForm({
  staffPartyIds,
  fromDate,
  toDate,
}: CoverPrintFormProps) {
  const { t } = useTranslation(['printing', 'common']);

  const { data: coverData, isLoading } = usePrintSubstitution({
    staffPartyIds,
    fromDate: fromDate.format('YYYY-MM-DD'),
    toDate: toDate.format('YYYY-MM-DD'),
  });

  const handlePrint = async () => {
    const f = {
      staffPartyIds,
      fromDate: fromDate.format('YYYY-MM-DD'),
      toDate: toDate.format('YYYY-MM-DD'),
    };
    const printResponse = await getPrintSubstitution(f);

    if (
      printResponse &&
      printResponse.print_substitution &&
      printResponse.print_substitution.url
    )
      window.open(printResponse.print_substitution.url, '_blank', 'noreferrer');
  };

  return (
    <>
      <Stack justifyContent="right" direction="row" gap={1.5}>
        <LoadingButton
          size="large"
          variant="contained"
          loading={isLoading}
          onClick={handlePrint}
        >
          {t('common:actions.print')}
        </LoadingButton>
      </Stack>
      <Stack style={{ maxHeight: '100%', overflow: 'auto' }}>
        {coverData && coverData.html && (
          <div
            style={{ maxHeight: '100%', overflow: 'auto' }}
            dangerouslySetInnerHTML={{ __html: coverData.html }}
          />
        )}
      </Stack>
    </>
  );
}
