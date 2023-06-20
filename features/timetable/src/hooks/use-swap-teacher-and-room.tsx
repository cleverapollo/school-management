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

interface LessonChangeState extends Lesson {
  teacherChangesByLessonId: Map<string, ChangeList>;
  roomChangesByLessonId: Map<string, ChangeList>;
}

export function useSwapTeacherAndRoom({
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

  const swapTeacher = ({ to, from }: ChangeList[number]) => {
    const lessonId = JSON.stringify(from.lesson.id);

    const findLessonIndex = changeState.findIndex(
      (lesson) => JSON.stringify(lesson.id) === lessonId
    );

    if (findLessonIndex === -1) return;

    const lesson = changeState[findLessonIndex];
    const changes = lesson.teacherChangesByLessonId.get(lessonId) ?? [];
    const indexOfExistingChange = changes.findIndex(
      ({ from: existingFrom }) => existingFrom.id === from.id
    );

    if (indexOfExistingChange === -1) {
      changes.push({ from, to });
    } else {
      changes[indexOfExistingChange] = { from, to };
    }

    lesson.teacherChangesByLessonId.set(lessonId, changes);

    setChangeState((prevState) => {
      const newState = [...prevState];
      newState[findLessonIndex] = lesson;

      return newState;
    });
  };

  const swapRoom = ({ to, from }: ChangeList[number]) => {};

  return {
    requestFilter,
    changeState,
    swapTeacher,
    swapRoom,
  };
}

export type ReturnTypeOfUseSwapTeacherAndRoom = ReturnType<
  typeof useSwapTeacherAndRoom
>;
