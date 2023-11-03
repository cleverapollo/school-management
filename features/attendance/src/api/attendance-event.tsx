import { useMutation } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  SaveEventAttendanceInput,
} from '@tyro/api';
import { attendanceKeys } from './keys';

const saveAttendance = graphql(/* GraphQL */ `
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

export function useSaveAttendance() {
  return useMutation({
    mutationFn: (input: SaveEventAttendanceInput[]) =>
      gqlClient.request(saveAttendance, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(attendanceKeys.all);
    },
  });
}
