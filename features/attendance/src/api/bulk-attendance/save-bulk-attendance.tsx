import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Attendance_SaveBulkAttendanceInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { groupsKeys } from '@tyro/groups';
import { attendanceKeys } from '../keys';

const saveBulkAttendance = graphql(/* GraphQL */ `
  mutation attendance_saveBulkAttendance(
    $input: Attendance_SaveBulkAttendanceInput
  ) {
    attendance_saveBulkAttendance(input: $input) {
      success
    }
  }
`);

export function useCreateBulkAttendance() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Attendance_SaveBulkAttendanceInput) =>
      gqlClient.request(saveBulkAttendance, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(attendanceKeys.all);
      await queryClient.invalidateQueries(groupsKeys.all);

      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
