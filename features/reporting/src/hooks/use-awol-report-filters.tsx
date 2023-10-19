import { useTranslation } from '@tyro/i18n';
import { Reporting_TableFilterType } from '@tyro/api';
import dayjs from 'dayjs';

export const useAwolReportFilters = () => {
  const { t } = useTranslation(['reports']);

  const defaultDate = dayjs().format('YYYY-MM-DD');

  return [
    {
      id: 'from_date',
      inputType: Reporting_TableFilterType.Date,
      label: t('reports:from'),
      defaultValue: defaultDate,
      required: true,
      minValue: defaultDate,
    },
    {
      id: 'to_date',
      inputType: Reporting_TableFilterType.Date,
      label: t('reports:to'),
      defaultValue: defaultDate,
      required: true,
      minValue: defaultDate,
    },
  ];
};
