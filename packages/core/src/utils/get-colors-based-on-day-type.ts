import { DayType } from '@tyro/api';

type StyledValues = {
  color: string;
  bgColor: string;
};

type GetColourBasedOnDayTypeFn = (dayType?: DayType) => StyledValues;

export const getColourBasedOnDayType: GetColourBasedOnDayTypeFn = (dayType) => {
  switch (dayType) {
    case DayType.Holiday:
      return {
        bgColor: 'green.500',
        color: 'white',
      };
    case DayType.Partial:
      return {
        bgColor: 'violet.400',
        color: 'white',
      };
    case DayType.StaffDay:
      return {
        bgColor: 'rose.500',
        color: 'white',
      };
    case DayType.SchoolDay:
      return {
        bgColor: 'blue.500',
        color: 'white',
      };
    default:
      return {
        bgColor: 'slate.50',
        color: 'grey.300',
      };
  }
};
