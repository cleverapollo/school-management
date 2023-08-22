import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  SaveEventAttendanceInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../../keys';

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
    onSuccess: () => {
      toast(t('common:snackbarMessages.updateSuccess'));
      queryClient.invalidateQueries(peopleKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
