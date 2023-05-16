import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  Tt_IndividualLessonsQuery,
  TtEditLessonPeriodInstanceWrapper,
  UseQueryReturnType,
} from '@tyro/api';

import { timetableKeys } from './keys';

const timetableList = graphql(/* GraphQL */ `
  query tt_individualLessons($filter: TTIndividualViewLessonFilter!) {
    tt_individualLessons(filter: $filter) {
      id {
        timetableId
        lessonIdx
        lessonInstanceIdx
        timetableGroupId
      }
      partyGroup {
        name
        partyId
      }
      room {
        name
        roomId
        capacity
      }
      teachers {
        person {
          partyId
          title
          firstName
          lastName
          avatarUrl
          type
        }
      }
      gridIdx
      dayIdx
      periodIdx
      roomId
      teacherIds
      spread
    }
  }
`);

const timetableLesson = graphql(/* GraphQL */ `
  query asd {
    tt_timetables {
      timetableId
      name
    }
  }
`);

const updateTimetableLessons = graphql(/* GraphQL */ `
  mutation tt_editLessonInstance($input: TTEditLessonPeriodInstanceWrapper!) {
    tt_editLessonInstance(input: $input) {
      id {
        timetableId
        lessonIdx
        lessonInstanceIdx
        timetableGroupId
      }
      partyGroup {
        name
        partyId
      }
      gridIdx
      dayIdx
      periodIdx
      roomId
      room {
        name
        roomId
        capacity
      }
      teacherIds
      teachers {
        partyId
        person {
          firstName
          lastName
        }
      }
      spread
    }
  }
`);

const timetablesQuery = (id: number) => ({
  queryKey: timetableKeys.timetables(id),
  queryFn: async () =>
    gqlClient.request(timetableList, {
      filter: {
        timetableId: id,
      },
    }),
});

export function getTimetables(id: number) {
  return queryClient.fetchQuery(timetablesQuery(id));
}

export function useTimetables(id: number) {
  return useQuery({
    ...timetablesQuery(id),
    select: useCallback(
      ({ tt_individualLessons }: Tt_IndividualLessonsQuery) =>
        tt_individualLessons.map((lesson) => ({
          ...lesson,
          teachers: lesson.teachers.map(({ person }) => person),
        })),
      []
    ),
  });
}

export function useUpdateTimetableLessons() {
  return useMutation({
    mutationFn: (input: TtEditLessonPeriodInstanceWrapper) =>
      gqlClient.request(updateTimetableLessons, {
        input,
      }),
  });
}

const timeTableLessonQuery = {
  queryKey: timetableKeys.all,
  queryFn: async () => gqlClient.request(timetableLesson),
};

export function getTimetableLesson() {
  return queryClient.fetchQuery(timeTableLessonQuery);
}

export function useTimetableLesson() {
  return useQuery({
    ...timeTableLessonQuery,
    select: ({ tt_timetables }) => {
      if (!Array.isArray(tt_timetables)) return [];
      return tt_timetables;
    },
  });
}

export type ReturnTypeFromUseTimetables = UseQueryReturnType<
  typeof useTimetables
>[number];

export type ReturnTypeFromUseTimeTableLesson = UseQueryReturnType<
  typeof useTimetableLesson
>[number];
