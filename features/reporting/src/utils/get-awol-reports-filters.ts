import { TFunction } from '@tyro/i18n';
import { Reporting_TableFilterType } from '@tyro/api';

export const getAwolReportsFilters = (
  t: TFunction<'reports'[], undefined>,
  defaultStartDate: string,
  defaultEndDate: string
) => [
  {
    id: 'from_date',
    inputType: Reporting_TableFilterType.Date,
    label: t('reports:from'),
    defaultValue: defaultStartDate,
    required: true,
    minValue: defaultStartDate,
  },
  {
    id: 'to_date',
    inputType: Reporting_TableFilterType.Date,
    label: t('reports:to'),
    defaultValue: defaultEndDate,
    required: true,
    minValue: defaultStartDate,
  },
];
