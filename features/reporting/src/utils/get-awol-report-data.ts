import { TFunction } from '@tyro/i18n';

export const getAwolReportsInfo = (t: TFunction<'reports'[], undefined>) => ({
  info: { id: 'awol-students', name: t('reports:awolStudents') },
  reports: [{ id: 'awol-students', name: t('reports:awolStudents') }],
});
