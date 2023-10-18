import { TFunction } from '@tyro/i18n';

export const getAttendanceAwolReportsInfo = (
  t: TFunction<'reports'[], undefined>
) => ({
  info: { id: 'awol-students', name: t('reports:awolStudents') },
  reports: [{ id: 'awol-students', name: t('reports:awolStudents') }],
});
