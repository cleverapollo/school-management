import { useState } from 'react';
import { useCacheWithExpiry } from '@tyro/core';
import {
  DayType,
  CalendarDayInfo,
  Calendar_CreateCalendarDayInput,
} from '@tyro/api';
import { isEqual } from 'lodash';
import { ReturnTypeFromCalendarDayInfo } from '../api/school-calendar/calendar-day-info';

type EditedRow = Record<
  string,
  Record<
    string,
    {
      originalValue: DayType | string | null | undefined;
      newValue: DayType | string | null | undefined;
    }
  >
>;

export const useEditableSchoolCalendarState = (
  data?: ReturnTypeFromCalendarDayInfo
) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [editedRows, setEditedRows] = useCacheWithExpiry<EditedRow>(
    'bulk-edit',
    {}
  );

  const handleCalendarChanges = (
    change: Omit<Calendar_CreateCalendarDayInput, 'date'>
  ) => {
    const days = selectedDays.map((date) => ({
      date,
      ...change,
    }));

    setEditedRows((prev) => ({
      ...(prev ?? {}),
      ...days
        .map((day) => {
          const previousDayChanges = prev[day.date] ?? {};

          Object.keys(day)
            .filter((key) => key !== 'date')
            .forEach((key) => {
              const newValue =
                day[
                  key as keyof Pick<
                    CalendarDayInfo,
                    'dayType' | 'startTime' | 'endTime' | 'description'
                  >
                ];
              const oldValue = data?.dayInfo?.find(
                ({ date }) => date === day.date
              )?.[
                key as keyof Pick<
                  CalendarDayInfo,
                  'dayType' | 'startTime' | 'endTime' | 'description'
                >
              ];

              if (!previousDayChanges[key]) {
                if (!isEqual(oldValue, newValue)) {
                  previousDayChanges[key] = {
                    originalValue: oldValue ?? null,
                    newValue: newValue ?? null,
                  };
                }
              } else {
                previousDayChanges[key].newValue = newValue;
              }

              if (
                isEqual(
                  previousDayChanges[key]?.originalValue,
                  newValue ?? null
                ) ||
                previousDayChanges[key] === undefined
              ) {
                delete previousDayChanges[key];
              }
              if (Object.keys(previousDayChanges).length === 0) {
                delete prev[key];
              }
            });

          return {
            ...previousDayChanges,
            date: day.date,
          } as CalendarDayInfo & { date: string };
        })
        .reduce((acc, { date, dayType, startTime, endTime, description }) => {
          if (
            date &&
            (dayType !== undefined ||
              startTime !== undefined ||
              endTime !== undefined ||
              description !== undefined)
          ) {
            acc[date] = {
              ...(dayType !== undefined ? { dayType } : {}),
              ...(startTime !== undefined ? { startTime } : {}),
              ...(endTime !== undefined ? { endTime } : {}),
              ...(description !== undefined ? { description } : {}),
            } as EditedRow['string'];
          }

          return acc;
        }, {} as EditedRow),
    }));
    setSelectedDays([]);
  };

  return {
    editedRows,
    setEditedRows,
    selectedDays,
    setSelectedDays,
    handleCalendarChanges,
  };
};
