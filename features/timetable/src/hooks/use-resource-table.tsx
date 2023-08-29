import { useMemo, useCallback, useState, useEffect } from 'react';
import groupBy from 'lodash/groupBy';
import { nanoid } from 'nanoid';
import { TtGridPeriodType, TtTimeslotId, TtTimeslotInfo } from '@tyro/api';
import {
  wasMultiSelectKeyUsed,
  wasToggleInSelectionGroupKeyUsed,
} from '@tyro/core';
import { ReturnTypeFromUseTimetableResourceView } from '../api/edit-timetable/resource-view';
import { getResourceName } from '../utils/get-resource-name';

export type Lesson =
  ReturnTypeFromUseTimetableResourceView[number]['lessons'][number] & {
    type?: undefined;
    gridId?: undefined;
  };

export type Resource =
  | Lesson
  | {
      id: string;
      type: 'break';
      gridId?: number;
      timeslotInfo: Pick<TtTimeslotInfo, 'startTime' | 'endTime'>;
    }
  | { id: string; type: 'finished'; gridId?: number; timeslotInfo: undefined };

const getIdFromTimeslotIds = (timeslotIds: TtTimeslotId | undefined | null) => {
  const { gridIdx, dayIdx, periodIdx } = timeslotIds ?? {};
  return `${gridIdx ?? 0}-${dayIdx ?? 0}-${periodIdx ?? 0}`;
};

export function useResourceTable(
  resources: ReturnTypeFromUseTimetableResourceView
) {
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const resourcesGroupedByDay = useMemo(
    () => groupBy(resources, 'timeslotIds.dayIdx'),
    [resources]
  );

  const { days, periods } = useMemo(() => {
    const dayWithMostPeriods = Object.values({
      ...resourcesGroupedByDay,
    }).sort((a, b) => b.length - a.length)[0];

    return {
      days: Object.keys(resourcesGroupedByDay).map(Number),
      periods: dayWithMostPeriods.map(
        ({ timeslotIds }) => timeslotIds?.periodIdx ?? 0
      ),
    };
  }, [resourcesGroupedByDay]);

  const { gridIds, lessonsByTimeslotId, lessonsById } = useMemo(() => {
    const ids = new Set<number>();
    const lessonsMap = new Map<string, Resource>();
    const lessonsLists = resources?.reduce(
      (acc, { timeslotIds, timeslots, lessons }) => {
        if (timeslotIds?.gridIdx) {
          ids.add(timeslotIds?.gridIdx);
        }

        const id = getIdFromTimeslotIds(timeslotIds);
        const breakLesson =
          timeslots?.periodType === TtGridPeriodType.Break
            ? [
                {
                  id: nanoid(10),
                  type: 'break' as const,
                  gridId: timeslotIds?.gridIdx,
                  timeslotInfo: {
                    startTime: timeslots?.startTime,
                    endTime: timeslots?.endTime,
                  },
                },
              ]
            : [];

        const resourceLessons = [
          ...breakLesson,
          ...lessons.sort((a, b) =>
            getResourceName(a).localeCompare(getResourceName(b))
          ),
        ];

        resourceLessons.forEach((lesson) => {
          const lessonId = JSON.stringify(lesson.id);
          lessonsMap.set(lessonId, lesson);
        });

        acc.set(id, resourceLessons);
        return acc;
      },
      new Map() as Map<string, Array<Resource>>
    );

    return {
      gridIds: Array.from(ids),
      lessonsByTimeslotId: lessonsLists,
      lessonsById: lessonsMap,
    };
  }, [resources]);

  const getResourcesByTimeslotId = useCallback(
    (timeslotIds: TtTimeslotId) => {
      const id = getIdFromTimeslotIds(timeslotIds);
      return (
        lessonsByTimeslotId.get(id) ?? [
          {
            id,
            type: 'finished' as const,
            gridId: timeslotIds.gridIdx,
            timeslotInfo: undefined,
          },
        ]
      );
    },
    [gridIds, lessonsByTimeslotId]
  );

  const toggleLessonSelection = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, lesson: Lesson) => {
      setSelectedLessonIds((prev) => {
        const idString = JSON.stringify(lesson.id);

        if (wasMultiSelectKeyUsed(event) && prev.length > 0) {
          const lastLessonId = prev[prev.length - 1];
          const lastLesson = lessonsById.get(lastLessonId) as Lesson;
          const clickedLesson = lessonsById.get(idString) as Lesson;

          if (lastLesson.timeslotId && clickedLesson.timeslotId) {
            const lastLessonTimeslotIds = getIdFromTimeslotIds(
              lastLesson.timeslotId
            );
            const clickedLessonTimeslotIds = getIdFromTimeslotIds(
              clickedLesson.timeslotId
            );
            const clickedResources = getResourcesByTimeslotId(
              clickedLesson.timeslotId
            );
            const clickedLessonIndex = clickedResources.findIndex(
              (resource) => resource.id === clickedLesson.id
            );

            if (lastLessonTimeslotIds === clickedLessonTimeslotIds) {
              const lastLessonIndex = clickedResources.findIndex(
                (resource) => resource.id === lastLesson.id
              );

              const [start, end] = [
                Math.min(lastLessonIndex, clickedLessonIndex),
                Math.max(lastLessonIndex, clickedLessonIndex),
              ];
              const resourcesToSelect = clickedResources
                .slice(start, end + 1)
                .map((resource) => JSON.stringify(resource.id));
              return Array.from(new Set([...prev, ...resourcesToSelect]));
            }
            const resourcesToSelect = clickedResources
              .slice(0, clickedLessonIndex + 1)
              .map((resource) => JSON.stringify(resource.id));
            return Array.from(new Set(resourcesToSelect));
          }
        }

        return selectedLessonIds.includes(idString)
          ? prev.filter((id) => id !== idString)
          : [...prev, idString];
      });
    },
    [selectedLessonIds]
  );

  useEffect(() => {
    const onWindowClickOrTouchEnd = (event: MouseEvent | TouchEvent) => {
      if (event.defaultPrevented) return;

      setSelectedLessonIds((prevState) =>
        prevState.length > 0 ? [] : prevState
      );
    };

    const onWindowKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      if (event.key === 'Escape') {
        setSelectedLessonIds((prevState) =>
          prevState.length > 0 ? [] : prevState
        );
      }
    };

    window.addEventListener('click', onWindowClickOrTouchEnd);
    window.addEventListener('touchend', onWindowClickOrTouchEnd);
    window.addEventListener('keydown', onWindowKeyDown);

    return () => {
      window.removeEventListener('click', onWindowClickOrTouchEnd);
      window.removeEventListener('touchend', onWindowClickOrTouchEnd);
      window.removeEventListener('keydown', onWindowKeyDown);
    };
  }, []);

  return {
    gridIds,
    days,
    periods,
    getResourcesByTimeslotId,
    isLessonSelected: (lesson: Lesson) =>
      selectedLessonIds.includes(JSON.stringify(lesson.id)),
    selectedLessonIds,
    getLessons: (lessonIds: string[]) =>
      lessonIds.map((id) => lessonsById.get(id) as Lesson),
    toggleLessonSelection,
  };
}
