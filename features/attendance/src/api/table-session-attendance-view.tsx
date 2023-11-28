import { useQuery } from '@tanstack/react-query';
import {
  AttendanceCodeType,
  gqlClient,
  graphql,
  queryClient,
  StudentSessionAttendanceFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { attendanceKeys } from './keys';

type TypeForCombinedAttendanceData = string | null | undefined;
type OptionalTypeForCombinedAttendanceData = string | null;

type CombinedAttendanceDataType = {
  date: TypeForCombinedAttendanceData;
  time: TypeForCombinedAttendanceData;
  type: TypeForCombinedAttendanceData;
  attendanceCode: TypeForCombinedAttendanceData;
  attendanceCodeType?: AttendanceCodeType;
  details?: OptionalTypeForCombinedAttendanceData;
  updatedBy?: {
    firstName?: OptionalTypeForCombinedAttendanceData;
    lastName?: OptionalTypeForCombinedAttendanceData;
  };
  createdBy?: {
    firstName?: OptionalTypeForCombinedAttendanceData;
    lastName?: OptionalTypeForCombinedAttendanceData;
  };
  partyId: TypeForCombinedAttendanceData;
};

const tableSessionAttendanceView = graphql(/* GraphQL */ `
  query tableSessionAttendanceView($filter: StudentSessionAttendanceFilter) {
    attendance_studentSessionAttendance(filter: $filter) {
      dateAttendance {
        date
        bellTimeAttendance {
          bellTimeId
          bellTime {
            time
            name
          }
          attendanceCode {
            id
            name
            description
            code
            codeType
          }
          note
          createdBy {
            partyId
            firstName
            lastName
            avatarUrl
          }
          createdByPartyId
          updatedByPartyId
          updatedBy {
            firstName
            lastName
            partyId
            avatarUrl
          }
        }
      }
    }
  }
`);

const tableSessionAttendanceQuery = (
  filter: StudentSessionAttendanceFilter
) => ({
  queryKey: attendanceKeys.tableSessionAttendance(filter),
  queryFn: async () => {
    const { attendance_studentSessionAttendance: sessionAttendance } =
      await gqlClient.request(tableSessionAttendanceView, {
        filter,
      });
    const data = sessionAttendance[0]?.dateAttendance
      ?.filter((items) => items?.bellTimeAttendance.length > 0)
      .map((item) => ({
        ...item,
        bellTimeAttendance: item.bellTimeAttendance.map((ba) => ({
          ...ba,
          date: item.date,
          partyId: `${item.date}-${ba.bellTimeId}`,
        })),
      }))
      .flatMap((session) => session.bellTimeAttendance)
      ?.reduce<CombinedAttendanceDataType[]>((acc, currentItem) => {
        const { attendanceCode, bellTime, createdBy, date, note, partyId } =
          currentItem || {};
        if (bellTime) {
          const formattedData: CombinedAttendanceDataType = {
            date,
            time: bellTime?.time,
            type: bellTime?.name,
            attendanceCode: attendanceCode?.name,
            attendanceCodeType: attendanceCode?.codeType,
            details: note,
            createdBy: {
              firstName: createdBy?.firstName,
              lastName: createdBy?.lastName,
            },
            partyId,
          };
          acc.push(formattedData);
        }
        return acc;
      }, []);

    return { attendance_studentSessionAttendance: data };
  },
});

export function getTableSessionAttendanceQuery(
  filter: StudentSessionAttendanceFilter
) {
  return queryClient.fetchQuery(tableSessionAttendanceQuery(filter));
}

export function useTableSessionAttendance(
  filter: StudentSessionAttendanceFilter
) {
  return useQuery({
    ...tableSessionAttendanceQuery(filter),
    select: ({ attendance_studentSessionAttendance }) =>
      attendance_studentSessionAttendance,
  });
}

export type ReturnTypeFromUseTableSessionAttendance = UseQueryReturnType<
  typeof useTableSessionAttendance
>;
