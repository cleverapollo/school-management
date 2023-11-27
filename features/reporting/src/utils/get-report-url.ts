import dayjs from 'dayjs';

export enum Report {
  AWOL = 'awol',
  SUBSTITUTION = 'substitution',
  OCTOBER_RETURNS = 'october-returns',
  SESSION_ATTENDANCE = 'session-attendance',
  STUDENT_BEHAVIOUR = 'student-behaviour',
  STUDENT_DATA = 'student-data',
  SUBJECT_STATS_OCTOBER_RETURNS = 'subject-stats-october-returns',
  SUBJECT_STUDENT_COUNT_MATRIX = 'subject-student-count-matrix',
  TEACHER_HOURS = 'teacher-hours',
  TUSLA = 'tusla',
}

const reportUrls = {
  [Report.AWOL]: 'awol-students',
  [Report.SUBSTITUTION]: 'substitution-list',
  [Report.OCTOBER_RETURNS]: 'october-returns',
  [Report.SESSION_ATTENDANCE]: 'session-attendance',
  [Report.STUDENT_BEHAVIOUR]: 'student-behaviour',
  [Report.STUDENT_DATA]: 'student-data',
  [Report.SUBJECT_STATS_OCTOBER_RETURNS]: 'subject-stats-october-returns',
  [Report.SUBJECT_STUDENT_COUNT_MATRIX]: 'subject-student-count-matrix',
  [Report.TEACHER_HOURS]: 'teacher-hours',
  [Report.TUSLA]: 'tusla',
} as const;

const tabs = {
  [Report.OCTOBER_RETURNS]: {
    'cover-stats': 'course-stats-october-returns',
    'school-stats': 'school-stats-october-returns',
    'subject-stats': 'subject-stats-october-returns',
  },
} as const;

const defaultTabs = {
  [Report.OCTOBER_RETURNS]: tabs[Report.OCTOBER_RETURNS]['cover-stats'],
} as const;

type Tabs = typeof tabs;

type Options =
  | {
      report: Report.AWOL;
    }
  | {
      report: Report.SUBSTITUTION;
    }
  | {
      report: Report.OCTOBER_RETURNS;
      tab?: Tabs[Report.OCTOBER_RETURNS][keyof Tabs[Report.OCTOBER_RETURNS]];
    }
  | {
      report: Report.SESSION_ATTENDANCE;
    }
  | {
      report: Report.STUDENT_BEHAVIOUR;
      filters?: {
        to_date?: dayjs.Dayjs;
        from_date?: dayjs.Dayjs;
        class?: Array<string | number>;
        behaviour_category_id?: Array<string | number>;
        tags?: Array<string | number>;
      };
    }
  | {
      report: Report.STUDENT_DATA;
    }
  | {
      report: Report.SUBJECT_STATS_OCTOBER_RETURNS;
    }
  | {
      report: Report.SUBJECT_STUDENT_COUNT_MATRIX;
    }
  | {
      report: Report.TEACHER_HOURS;
    }
  | {
      report: Report.TUSLA;
    };

export function getReportUrl({ report, ...options }: Options) {
  const reportId = reportUrls[report];
  let tab = report === Report.AWOL ? '' : reportUrls[report];
  let filters = '';

  if (report in tabs && report in defaultTabs) {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    tab = tabs[report]?.[options.tab] || defaultTabs[report];
  }

  if ('filters' in options && Object.keys(options?.filters ?? {}).length > 0) {
    filters = Object.entries(options?.filters ?? {}).reduce(
      (acc, [key, value], index) => {
        const typedValue = value as
          | string
          | number
          | Array<string | number>
          | dayjs.Dayjs;
        let formattedValue = typedValue.toString();

        if (Array.isArray(typedValue)) {
          formattedValue = typedValue.join(',');
        } else if (dayjs.isDayjs(typedValue)) {
          formattedValue = typedValue.format('YYYY-MM-DD');
        }

        return index === 0
          ? `${acc}${key}=${formattedValue}`
          : `${acc}&${key}=${formattedValue}`;
      },
      '?'
    );
  }

  return `/reports/${reportId}/${tab}${filters}`;
}
