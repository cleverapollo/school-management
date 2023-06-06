import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';

import { timetableKeys } from './keys';

// const timetableLessons = graphql(/* GraphQL */ `
//   query tt_individualLessons($filter: TTIndividualViewLessonFilter!) {
//     tt_individualLessons(filter: $filter) {
//       id {
//         timetableId
//         lessonIdx
//         lessonInstanceIdx
//         timetableGroupId
//       }
//       partyGroup {
//         name
//         partyId
//       }
//       room {
//         name
//         roomId
//         capacity
//       }
//       teachers {
//         person {
//           partyId
//           title
//           firstName
//           lastName
//           avatarUrl
//           type
//         }
//       }
//       gridIdx
//       dayIdx
//       periodIdx
//       roomId
//       teacherIds
//       spread
//     }
//   }
// `);

const timetablesQuery = (id: number) => ({
  queryKey: timetableKeys.timetables(id),
  queryFn: () => {},
  // gqlClient.request(timetableLessons, {
  //   filter: {
  //     timetableId: id,
  //   },
  // }),
});

export function getTimetables(id: number) {
  return queryClient.fetchQuery(timetablesQuery(id));
}

export function useTimetables(id: number) {
  return useQuery({
    ...timetablesQuery(id),
    select: () => [],
    // useCallback(
    //   ({ tt_individualLessons }: Tt_IndividualLessonsQuery) =>
    //     tt_individualLessons.map((lesson) => ({
    //       ...lesson,
    //       teachers: lesson.teachers.map(({ person }) => person),
    //     })),
    //   []
    // ),
  });
}

export type ReturnTypeFromUseTimetables = UseQueryReturnType<
  typeof useTimetables
>[number];
