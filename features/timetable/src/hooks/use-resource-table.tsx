import { useMemo, useCallback, useState } from 'react';
import groupBy from 'lodash/groupBy';
import { nanoid } from 'nanoid';
import { TtGridPeriodType, TtTimeslotId, TtTimeslotInfo } from '@tyro/api';
import {
  wasMultiSelectKeyUsed,
  wasToggleInSelectionGroupKeyUsed,
} from '@tyro/core';
import { ReturnTypeFromUseTimetableResourceView } from '../api/resource-view';
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
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
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
        const resourceLessons =
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
            : lessons.sort((a, b) =>
                getResourceName(a).localeCompare(getResourceName(b))
              );

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
      setSelectedLessons((prev) => {
        const idString = JSON.stringify(lesson.id);

        if (wasToggleInSelectionGroupKeyUsed(event)) {
          return selectedLessons.includes(idString)
            ? prev.filter((id) => id !== idString)
            : [...prev, idString];
        }

        // if (wasMultiSelectKeyUsed(event)) {
        //   return multiSelectTo(studentId, selectedIds, state);
        // }

        return [idString];
      });
    },
    [selectedLessons]
  );

  return {
    gridIds,
    days,
    periods,
    getResourcesByTimeslotId,
    isLessonSelected: (lesson: Lesson) =>
      selectedLessons.includes(JSON.stringify(lesson.id)),
    toggleLessonSelection,
  };
}
