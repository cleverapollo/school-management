import {
  SaveEventAttendanceInput,
  UseQueryReturnType,
  CalendarEventIteratorFilter,
  Iterator,
  queryClient,
} from '@tyro/api';

import { useSaveAttendance } from '@tyro/attendance';

import isEqual from 'lodash/isEqual';

import { useLayoutEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import {
  ReturnTypeFromUseSubjectGroupLessonByIterator,
  useSubjectGroupById,
  useSubjectGroupLessonByIterator,
} from '../api';
import { groupsKeys } from '../api/keys';
import { useFormatLessonTime } from './use-format-lesson-time';

type EventDetails = NonNullable<
  NonNullable<
    ReturnTypeFromUseSubjectGroupLessonByIterator['extensions']
  >['eventAttendance']
>[number];

type StudentAttendance = Record<
  SaveEventAttendanceInput['personPartyId'],
  SaveEventAttendanceInput & EventDetails
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
  const currentStartTime = useRef(dayjs().format('YYYY-MM-DD[T]HH:mm:ss'));

  const [filter, setFilter] = useState<CalendarEventIteratorFilter>({
    partyId,
    iterator: Iterator.Closest,
  });

  const { mutate: saveAttendanceMutation, isLoading: isSaveAttendanceLoading } =
    useSaveAttendance();

  const {
    data: lessonData,
    isLoading: isLessonLoading,
    isSuccess: isLessonSuccess,
  } = useSubjectGroupLessonByIterator({
    ...filter,
    partyId,
  });

  const eventAttendance = lessonData?.extensions?.eventAttendance || [];

  useLayoutEffect(() => {
    if (lessonData) {
      currentStartTime.current = lessonData.startTime;
      const date = dayjs(lessonData.startTime).format('YYYY-MM-DD');

      const studentAttendance = eventAttendance.reduce((acc, event) => {
        if (event) {
          acc[event.personPartyId] = { ...event, date };
        }
        return acc;
      }, {} as StudentAttendance);

      initialAttendanceRef.current = (students || []).reduce((acc, student) => {
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

      setNewAttendance(initialAttendanceRef.current);
    }
  }, [lessonData, students]);

  const formattedLessonDate = useFormatLessonTime({
    startTime: lessonData?.startTime ?? '',
    endTime: lessonData?.endTime ?? '',
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
      eventStartTime: lessonData?.startTime || currentStartTime.current,
    });
  };

  const getStudentAttendanceCode = (studentId: number) =>
    newAttendance[studentId]?.attendanceCodeId;

  const getStudentEventDetails = (studentId: number) =>
    newAttendance[studentId];

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
    // NOTE: do not send student if he was already the attendance taken
    const attendanceInput = Object.values(newAttendance).filter(
      (attendance) => !attendance.adminSubmitted
    );

    saveAttendanceMutation(attendanceInput, {
      onSuccess: () => {
        queryClient.invalidateQueries(groupsKeys.subject.all());
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
    getStudentEventDetails,
    saveAttendance,
    cancelAttendance,
  };
}
