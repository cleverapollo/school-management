import { AttendanceCodeType } from '@tyro/api';

type ExtendedAttendanceCodeType = AttendanceCodeType | 'PARTIAL_ABSENCE';

type StyledValues = {
  color: string;
  bgColor: string;
  hoverBg?: string;
};

type Variants = 'soft' | 'filled';

type ColorsByVariant = Record<Variants, StyledValues>;

type GetColourBasedOnAttendanceTypeFn = (
  attendanceCode: ExtendedAttendanceCodeType
) => {
  base: string;
} & ColorsByVariant;

export const getColourBasedOnAttendanceType: GetColourBasedOnAttendanceTypeFn =
  (attendanceCode) => {
    switch (attendanceCode) {
      case AttendanceCodeType.Present: {
        const base = 'emerald';

        return {
          base,
          filled: {
            color: 'white',
            bgColor: `${base}.500`,
            hoverBg: `${base}.700`,
          },
          soft: {
            color: `${base}.600`,
            bgColor: `${base}.100`,
          },
        };
      }
      case AttendanceCodeType.ExplainedAbsence: {
        const base = 'pink';

        return {
          base,
          filled: {
            color: 'white',
            bgColor: `${base}.500`,
            hoverBg: `${base}.600`,
          },
          soft: {
            color: `${base}.600`,
            bgColor: `${base}.100`,
          },
        };
      }
      case AttendanceCodeType.UnexplainedAbsence: {
        const base = 'violet';

        return {
          base,
          filled: {
            color: 'white',
            bgColor: `${base}.700`,
            hoverBg: `${base}.900`,
          },
          soft: {
            color: `${base}.700`,
            bgColor: `${base}.100`,
          },
        };
      }

      case AttendanceCodeType.Late: {
        const base = 'sky';

        return {
          base,
          filled: {
            color: 'white',
            bgColor: `${base}.400`,
            hoverBg: `${base}.600`,
          },
          soft: {
            color: `${base}.600`,
            bgColor: `${base}.100`,
          },
        };
      }

      case 'PARTIAL_ABSENCE': {
        const base = 'amber';

        return {
          base,
          filled: {
            color: 'white',
            bgColor: `${base}.500`,
            hoverBg: `${base}.600`,
          },
          soft: {
            color: `${base}.500`,
            bgColor: `${base}.100`,
          },
        };
      }

      case AttendanceCodeType.NotTaken:
      default: {
        const base = 'zinc';

        return {
          base,
          filled: {
            color: `${base}.700`,
            bgColor: `${base}.300`,
            hoverBg: `${base}.400`,
          },
          soft: {
            color: `${base}.500`,
            bgColor: `${base}.100`,
          },
        };
      }
    }
  };
