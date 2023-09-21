import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  SaveEventAttendanceInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { groupsKeys } from '@tyro/groups';
import { attendanceKeys } from './keys';

const saveStudentEventAttendance = graphql(/* GraphQL */ `
  mutation attendance_saveEventAttendance($input: [SaveEventAttendanceInput]) {
    attendance_saveEventAttendance(input: $input) {
      id
      eventId
      attendanceCodeId
      personPartyId
      date
    }
  }
`);

export function useCreateOrUpdateEventAttendance() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: SaveEventAttendanceInput[]) =>
      gqlClient.request(saveStudentEventAttendance, { input }),
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
