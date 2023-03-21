import {
  SaveEventAttendanceInput,
  UseQueryReturnType,
  CalendarEventIteratorFilter,
  Iterator,
  queryClient,
} from '@tyro/api';

import isEqual from 'lodash/isEqual';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import {
  subjectGroupsKeys,
  useSaveSubjectGroupAttendance,
  useSubjectGroupById,
  useSubjectGroupLessonByIterator,
} from '../api/subject-groups';
import { useFormatLessonTime } from './use-format-lesson-time';

type StudentAttendance = Record<
  SaveEventAttendanceInput['personPartyId'],
  SaveEventAttendanceInput
>;

type UseHandleLessonAttendanceParams = {
  partyId: number;
  students: UseQueryReturnType<typeof useSubjectGroupById>['students'];
};

type SaveAttendanceCallback = {
  onSuccess: () => void;
};

export function useHandleLessonAttendance({
  partyId,
  students,
}: UseHandleLessonAttendanceParams) {
  const initialAttendanceRef = useRef<StudentAttendance>({});
  const [newAttendance, setNewAttendance] = useState<StudentAttendance>({});

  const [filter, setFilter] = useState<CalendarEventIteratorFilter>({
    partyId,
    iterator: Iterator.Closest,
  });

  const { mutate: saveAttendanceMutation, isLoading: isSaveAttendanceLoading } =
    useSaveSubjectGroupAttendance();

  const {
    data: lessonData,
    isLoading: isLessonLoading,
    isSuccess: isLessonSuccess,
  } = useSubjectGroupLessonByIterator({
    ...filter,
    partyId,
  });

  const eventAttendance = lessonData?.eventAttendance || [];
  const currentStudents = students || [];

  initialAttendanceRef.current = useMemo<StudentAttendance>(() => {
    if (lessonData) {
      const date = dayjs(lessonData.startTime).format('YYYY-MM-DD');

      const studentAttendance = eventAttendance.reduce((acc, event) => {
        if (event) {
          acc[event.personPartyId] = { ...event, date };
        }
        return acc;
      }, {} as StudentAttendance);

      return currentStudents.reduce((acc, student) => {
        if (student) {
          acc[student.partyId] = {
            ...studentAttendance[student.partyId],
            eventId: lessonData.eventId,
            personPartyId: student.partyId,
            date,
          };
        }
        return acc;
      }, {} as StudentAttendance);
    }

    return {};
  }, [students, lessonData]);

  useLayoutEffect(() => {
    if (lessonData?.eventId) {
      setNewAttendance(initialAttendanceRef.current);
    }
  }, [lessonData]);

  const formattedLessonDate = useFormatLessonTime({
    startTime: lessonData?.startTime,
    endTime: lessonData?.endTime,
  });

  const nextLesson = () => {
    setFilter({
      ...filter,
      iterator: Iterator.Next,
      eventStartTime: lessonData?.startTime,
    });
  };

  const previousLesson = () => {
    setFilter({
      ...filter,
      iterator: Iterator.Previous,
      eventStartTime: lessonData?.startTime,
    });
  };

  const getStudentAttendanceCode = (studentId: number) =>
    newAttendance[studentId]?.attendanceCodeId;

  const setStudentAttendanceCode = (studentId: number) => (codeId: number) => {
    setNewAttendance((currentAttendance) => ({
      ...currentAttendance,
      [studentId]: {
        ...currentAttendance[studentId],
        attendanceCodeId: codeId,
      },
    }));
  };

  const saveAttendance = ({ onSuccess }: SaveAttendanceCallback) => {
    saveAttendanceMutation(Object.values(newAttendance), {
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            const lessonKey = subjectGroupsKeys.lessonDetails(filter)[3];
            const queryKey = query.queryKey[3] as typeof lessonKey;

            return queryKey?.partyId === lessonKey.partyId;
          },
        });
        onSuccess();
      },
    });
  };

  const cancelAttendance = () => {
    setNewAttendance(initialAttendanceRef.current);
  };

  return {
    lessonId: lessonData?.eventId,
    formattedLessonDate,
    isEmptyLesson: isLessonSuccess && !lessonData,
    isEditing:
      eventAttendance.length > 0 &&
      !isEqual(newAttendance, initialAttendanceRef.current),
    isLessonLoading,
    isSaveAttendanceLoading,
    nextLesson,
    previousLesson,
    getStudentAttendanceCode,
    setStudentAttendanceCode,
    saveAttendance,
    cancelAttendance,
  };
}
