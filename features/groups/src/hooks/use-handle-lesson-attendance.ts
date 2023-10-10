import {
  SaveEventAttendanceInput,
  CalendarEventIteratorFilter,
  Iterator,
  queryClient,
  AttendanceCodeType,
  Person,
} from '@tyro/api';

import { useSaveAttendance } from '@tyro/attendance';

import isEqual from 'lodash/isEqual';

import { useLayoutEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import {
  getSubjectGroupLesson,
  ReturnTypeFromUseSubjectGroupLessonByIterator,
  useSubjectGroupLessonByIterator,
} from '../api';
import { groupsKeys } from '../api/keys';
import { useFormatLessonTime } from './use-format-lesson-time';
import { getValidEventStartTime } from '../utils/get-valid-event-start-time';

type EventDetails = NonNullable<
  NonNullable<
    ReturnTypeFromUseSubjectGroupLessonByIterator['extensions']
  >['eventAttendance']
>[number];

type StudentAttendance = Record<
  SaveEventAttendanceInput['personPartyId'],
  SaveEventAttendanceInput & EventDetails
>;

export type GroupStudent = {
  partyId: number;
  classGroup?: {
    name?: string;
  } | null;
  person: Pick<Person, 'firstName' | 'lastName' | 'avatarUrl'>;
};

type UseHandleLessonAttendanceParams = {
  partyId: number;
  eventStartTime?: string | null;
  students: GroupStudent[];
};

type SaveAttendanceCallback = {
  additionalLessonIds: number[];
  onSuccess: () => void;
};

export function useHandleLessonAttendance({
  partyId,
  eventStartTime,
  students,
}: UseHandleLessonAttendanceParams) {
  const initialAttendanceRef = useRef<StudentAttendance>({});
  const [newAttendance, setNewAttendance] = useState<StudentAttendance>({});
  const currentStartTime = useRef(dayjs().format('YYYY-MM-DD[T]HH:mm:ss'));

  const [filter, setFilter] = useState<CalendarEventIteratorFilter>({
    partyId,
    eventStartTime: getValidEventStartTime(eventStartTime),
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
  const currentLessonId = lessonData?.eventId ?? 0;
  const currentLessonStartTime = lessonData?.startTime ?? '';

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
    newAttendance[studentId]?.attendanceCodeId ?? AttendanceCodeType.Present;

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

  const saveAttendance = ({
    additionalLessonIds,
    onSuccess,
  }: SaveAttendanceCallback) => {
    // NOTE: do not send student if he was already the attendance taken
    const currentLessonAttendance = Object.values(newAttendance).filter(
      (attendance) => !attendance.adminSubmitted
    );

    const attendanceInput = [currentLessonId, ...additionalLessonIds].map(
      (eventId) =>
        currentLessonAttendance.map((currentLesson) => ({
          ...currentLesson,
          eventId,
        }))
    );

    saveAttendanceMutation(attendanceInput.flat(), {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(groupsKeys.subject.all()),
          getSubjectGroupLesson({
            partyId: filter.partyId,
            iterator: Iterator.Previous,
            eventStartTime: currentLessonStartTime,
          }),
          getSubjectGroupLesson({
            partyId: filter.partyId,
            iterator: Iterator.Next,
            eventStartTime: currentLessonStartTime,
          }),
        ]);
        onSuccess();
      },
    });
  };

  const cancelAttendance = () => {
    setNewAttendance(initialAttendanceRef.current);
  };

  return {
    lessonId: currentLessonId,
    eventsOnSameDayForSameGroup: lessonData?.eventsOnSameDayForSameGroup || [],
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
