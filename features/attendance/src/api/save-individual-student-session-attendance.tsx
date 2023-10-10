import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  SaveStudentSessionAttendanceInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { groupsKeys } from '@tyro/groups';
import { attendanceKeys } from './keys';

const saveStudentSessionAttendance = graphql(/* GraphQL */ `
  mutation saveStudentSessionAttendance(
    $input: SaveStudentSessionAttendanceInput
  ) {
    attendance_saveStudentSessionAttendance(input: $input) {
      studentPartyId
    }
  }
`);

export function useCreateOrUpdateSessionAttendance() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: SaveStudentSessionAttendanceInput) =>
      gqlClient.request(saveStudentSessionAttendance, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(attendanceKeys.all);
      await queryClient.invalidateQueries(groupsKeys.subject.all());

      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
