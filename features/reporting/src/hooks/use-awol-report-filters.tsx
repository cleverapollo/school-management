import { useTranslation } from '@tyro/i18n';
import { Reporting_TableFilterType, useAcademicNamespace } from '@tyro/api';
import dayjs from 'dayjs';

export const useAwolReportFilters = () => {
  const { t } = useTranslation(['reports']);
  const { activeAcademicNamespace } = useAcademicNamespace();

  const academicYearStartDay =
    activeAcademicNamespace?.startDate || dayjs().format('YYYY-MM-DD');

  const defaultDate = dayjs().format('YYYY-MM-DD');

  return [
    {
      id: 'from_date',
      inputType: Reporting_TableFilterType.Date,
      label: t('reports:from'),
      defaultValue: defaultDate,
      required: true,
      minValue: academicYearStartDay,
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
