import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, SaveEventAttendanceInput } from '@tyro/api';

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
  });
}
