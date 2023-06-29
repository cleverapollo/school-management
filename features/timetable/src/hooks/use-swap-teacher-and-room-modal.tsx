import { useEffect, useMemo, useState } from 'react';
import { Lesson } from './use-resource-table';

interface UseSwapTeacherAndRoomProps {
  timetableId: number;
  lessons: Lesson[] | null;
}

type PartialLesson = {
  id: Lesson['id'];
  partyGroup: Pick<Lesson['partyGroup'], 'name'>;
};

export type SwapChange = {
  id: number;
  lesson: PartialLesson;
};

export type SwapChangeWithOptionalLesson = {
  id: number;
  lesson: PartialLesson | null;
};

type ChangeList = Array<{
  from: SwapChange;
  to: SwapChangeWithOptionalLesson;
}>;

export interface LessonChangeState extends Lesson {
  teacherChangesByLessonId: Map<string, ChangeList>;
  roomChangesByLessonId: Map<string, ChangeList>;
}

export function useSwapTeacherAndRoomModal({
  timetableId,
  lessons,
}: UseSwapTeacherAndRoomProps) {
  const [changeState, setChangeState] = useState<LessonChangeState[]>([]);

  const requestFilter = useMemo(() => {
    const lessonToSwap = lessons?.map((lesson) => lesson.id) ?? [];
    const gridIdx = lessons?.[0]?.timeslotId?.gridIdx ?? 0;

    return {
      timetableId,
      gridIdx,
      lessonToSwap,
    };
  }, [timetableId, lessons]);

  useEffect(() => {
    setChangeState(
      () =>
        lessons?.map((lesson) => ({
          ...lesson,
          teacherChangesByLessonId: new Map(),
          roomChangesByLessonId: new Map(),
        })) ?? []
    );
  }, [lessons]);

  const swapResource = (
    type: 'room' | 'teacher',
    { to, from }: ChangeList[number]
  ) => {
    const lessonId = JSON.stringify(from.lesson.id);

    const findLessonIndex = changeState.findIndex(
      (lesson) => JSON.stringify(lesson.id) === lessonId
    );

    if (findLessonIndex === -1) return;

    const lesson = changeState[findLessonIndex];
    const changesMap =
      type === 'teacher'
        ? lesson.teacherChangesByLessonId
        : lesson.roomChangesByLessonId;
    const changes = changesMap.get(lessonId) ?? [];
    const indexOfExistingFromChange = changes.findIndex(
      ({ from: existingFrom }) => existingFrom.id === from.id
    );
    const indexOfExistingToChange = changes.findIndex(
      ({ to: existingTo }) => existingTo.id === to.id
    );

    if (
      indexOfExistingFromChange !== -1 &&
      indexOfExistingFromChange === indexOfExistingToChange
    ) {
      changes.splice(indexOfExistingFromChange, 1);
    } else {
      [indexOfExistingFromChange, indexOfExistingToChange]
        .sort((a, b) => b - a)
        .forEach((index) => {
          if (index !== -1) {
            changes.splice(index, 1);
          }
        });

      changes.push({ from, to });
    }

    changesMap.set(lessonId, changes);

    setChangeState((prevState) => {
      const newState = [...prevState];
      newState[findLessonIndex] = lesson;

      return newState;
    });
  };

  return {
    requestFilter,
    changeState,
    swapTeacher: (args: ChangeList[number]) => {
      swapResource('teacher', args);
    },
    swapRoom: (args: ChangeList[number]) => {
      swapResource('room', args);
    },
  };
}

export type ReturnTypeOfUseSwapTeacherAndRoom = ReturnType<
  typeof useSwapTeacherAndRoomModal
>;
