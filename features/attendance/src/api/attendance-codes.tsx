import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  AttendanceCodeFilter,
  SaveAttendanceCodeInput,
  UseQueryReturnType,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { attendanceKeys } from './keys';

export type ReturnTypeFromUseAttendanceCodes = UseQueryReturnType<
  typeof useAttendanceCodes
>[number];

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
      sessionCodeType
      custom
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

const attendanceCodesQuery = (filter: AttendanceCodeFilter) => ({
  queryKey: attendanceKeys.codes(filter),
  queryFn: () => gqlClient.request(attendanceCodes, { filter }),
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
    mutationFn: async (input: SaveAttendanceCodeInput[]) =>
      gqlClient.request(createAttendanceCodes, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: (_, [code]) => {
      if (code?.id) {
        toast(t('common:snackbarMessages.updateSuccess'));
      } else {
        toast(t('common:snackbarMessages.createSuccess'));
      }
      queryClient.invalidateQueries(attendanceKeys.all);
    },
  });
}
