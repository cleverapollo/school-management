import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  AttendanceCodeFilter,
  SaveAttendanceCodeInput,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';

const attendanceCodes = graphql(/* GraphQL */ `
  query attendance_attendanceCodes($filter: AttendanceCodeFilter) {
    attendance_attendanceCodes(filter: $filter) {
      id
      name
      description
      code
      active
      visibleForTeacher
      visibleForContact
      nameTextId
      codeType
    }
  }
`);

const createAttendanceCodes = graphql(/* GraphQL */ `
  mutation attendance_saveAttendanceCode($input: [SaveAttendanceCodeInput]) {
    attendance_saveAttendanceCode(input: $input) {
      id
    }
  }
`);

const attendanceCodesKeys = {
  list: ['attendance', 'codes'] as const,
  createOrUpdateAttendanceCode: () =>
    [...attendanceCodesKeys.list, 'createOrUpdateAttendanceCode'] as const,
};

const attendanceCodesQuery = (filter: AttendanceCodeFilter) => ({
  queryKey: attendanceCodesKeys.list,
  queryFn: () => gqlClient.request(attendanceCodes, { filter }),
  staleTime: 1000 * 60 * 20,
});

export function useAttendanceCodes(filter: AttendanceCodeFilter) {
  return useQuery({
    ...attendanceCodesQuery(filter),
    select: ({ attendance_attendanceCodes }) => attendance_attendanceCodes,
  });
}

export function getAttendanceCodes(filter: AttendanceCodeFilter) {
  return queryClient.fetchQuery(attendanceCodesQuery(filter));
}

export function useCreateOrUpdateAttendanceCode() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationKey: attendanceCodesKeys.createOrUpdateAttendanceCode(),
    mutationFn: async (input: SaveAttendanceCodeInput[]) =>
      gqlClient.request(createAttendanceCodes, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: (_, variables) => {
      if (variables && variables.length > 0 && variables[0].id) {
        toast(t('common:snackbarMessages.updateSuccess'));
      } else {
        toast(t('common:snackbarMessages.createSuccess'));
      }
      queryClient.invalidateQueries(attendanceCodesKeys.list);
    },
  });
}
