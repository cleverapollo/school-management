import {
  SaveEventAttendanceInput,
  CalendarEventIteratorFilter,
  Iterator,
  queryClient,
  Person,
  Maybe,
  StudentGraphqlExtension,
  AttendanceCodeType,
} from '@tyro/api';

import {
  useAttendanceCodeById,
  useAttendanceCodeByType,
  useSaveAttendance,
} from '@tyro/attendance';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { usePreferredNameLayout } from '@tyro/core';
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

export type StudentAttendance = Record<
  SaveEventAttendanceInput['personPartyId'],
  SaveEventAttendanceInput &
    Partial<EventDetails> & { isEditMode?: boolean; attendanceCodeId: number }
>;

export type GroupStudent = {
  partyId: number;
  classGroup?: {
    name?: string;
  } | null;
  person: Pick<Person, 'firstName' | 'lastName' | 'avatarUrl' | 'partyId'>;
  extensions?: Maybe<Pick<StudentGraphqlExtension, 'priority'>>;
};

type UseHandleLessonAttendanceParams = {
  partyId: number;
  eventStartTime?: string | null;
  students: GroupStudent[];
};

type SaveAttendanceCallback = {
  lessonIds: number[];
  onSuccess: (invalidateQueryFn: () => Promise<void>) => void;
};

export function useHandleLessonAttendance({
  partyId,
  eventStartTime,
  students,
}: UseHandleLessonAttendanceParams) {
  const { displayName } = usePreferredNameLayout();

  const initialAttendanceRef = useRef<StudentAttendance>({});
  const currentStartTime = useRef(getValidEventStartTime(eventStartTime));

  const [newAttendance, setNewAttendance] = useState<StudentAttendance>({});

  const [filter, setFilter] = useState<CalendarEventIteratorFilter>({
    partyId,
    eventStartTime: currentStartTime.current,
    iterator: Iterator.Closest,
  });

  const codeByType = useAttendanceCodeByType({ teachingGroupCodes: true });
  const codeByIds = useAttendanceCodeById({ teachingGroupCodes: true });

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
  const previousAttendanceTypeByPersonPartyId = useMemo(
    () =>
      (lessonData?.extensions?.previousEventAttendance ?? []).reduce(
        (acc, previousAttendance) => {
          if (previousAttendance) {
            acc.set(
              previousAttendance.personPartyId,
              previousAttendance.attendanceCode?.codeType
            );
          }
          return acc;
        },
        new Map<number, AttendanceCodeType>()
      ),
    [lessonData?.extensions?.previousEventAttendance]
  );
  const currentLessonId = lessonData?.eventId ?? 0;
  const currentLessonStartTime = lessonData?.startTime ?? '';

  useLayoutEffect(() => {
    if (lessonData) {
      currentStartTime.current = lessonData.startTime;
      const date = dayjs(lessonData.startTime).format('YYYY-MM-DD');

      const studentAttendance = eventAttendance.reduce((acc, event) => {
        if (event) {
          acc[event.personPartyId] = {
            ...event,
            date,
          };
        }
        return acc;
      }, {} as StudentAttendance);

      initialAttendanceRef.current = (students || []).reduce((acc, student) => {
        if (student) {
          const currentStudent = studentAttendance[student.partyId];
          const presentId = codeByType?.PRESENT.id;

          acc[student.partyId] = {
            ...currentStudent,
            eventId: lessonData.eventId,
            personPartyId: student.partyId,
            attendanceCodeId: currentStudent?.attendanceCodeId ?? presentId,
            isEditMode: !currentStudent?.adminSubmitted ?? true,
            date,
          };
        }
        return acc;
      }, {} as StudentAttendance);

      setNewAttendance(initialAttendanceRef.current);
    }
  }, [lessonData, students, codeByType]);

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

  const editAttendance = (studentId: number) =>
    setNewAttendance((currentAttendance) => {
      const currentStudent = currentAttendance[studentId];

      return {
        ...currentAttendance,
        [studentId]: {
          ...currentStudent,
          isEditMode: true,
          note: '',
          adminSubmitted: false,
          attendanceCodeId:
            codeByIds?.[currentStudent?.attendanceCodeId]?.id ??
            codeByType?.PRESENT.id ??
            0,
        },
      };
    });

  const setStudentAttendanceCode = (studentId: number) => (codeId: number) => {
    setNewAttendance((currentAttendance) => ({
      ...currentAttendance,
      [studentId]: {
        ...currentAttendance[studentId],
        attendanceCodeId: codeId,
      },
    }));
  };

  const saveAttendance = ({ lessonIds, onSuccess }: SaveAttendanceCallback) => {
    // NOTE: do not send student if he was already the attendance taken
    const currentLessonAttendance = Object.values(newAttendance).filter(
      (attendance) => !attendance.adminSubmitted
    );

    const attendanceInput = lessonIds.map((eventId) =>
      currentLessonAttendance.map((currentLesson) => ({
        ...currentLesson,
        eventId,
      }))
    );

    saveAttendanceMutation(attendanceInput.flat(), {
      onSuccess: () => {
        onSuccess(async () => {
          await Promise.all([
            getSubjectGroupLesson({
              partyId: filter.partyId,
              iterator: Iterator.Closest,
              eventStartTime: currentStartTime.current,
            }),
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
            queryClient.invalidateQueries(groupsKeys.subject.all()),
          ]);
        });
      },
    });
  };

  const cancelAttendance = () => {
    setNewAttendance(initialAttendanceRef.current);
  };

  const unsavedChanges = useMemo(
    () =>
      Object.values(initialAttendanceRef.current).filter(
        ({ personPartyId, attendanceCodeId }) =>
          newAttendance[personPartyId]?.attendanceCodeId !== attendanceCodeId
      ).length,
    [newAttendance]
  );

  const isFirstTime = useMemo(
    () =>
      eventAttendance
        .filter((event) => !event?.adminSubmitted)
        .every((event) => !event?.attendanceCodeId),
    [eventAttendance]
  );

  return {
    lessonId: currentLessonId,
    currentLesson: lessonData,
    attendance: newAttendance,
    updatedAt: lessonData?.updatedAt ?? '',
    updatedBy: displayName(lessonData?.updatedBy) || '-',
    additionalLessons: lessonData?.additionalLessons || [],
    formattedLessonDate,
    isEmptyLesson: isLessonSuccess && !lessonData,
    unsavedChanges,
    isFirstTime,
    previousAttendanceTypeByPersonPartyId,
    isLessonLoading,
    isSaveAttendanceLoading,
    nextLesson,
    previousLesson,
    getStudentAttendanceCode,
    setStudentAttendanceCode,
    getStudentEventDetails,
    editAttendance,
    saveAttendance,
    cancelAttendance,
  };
}
