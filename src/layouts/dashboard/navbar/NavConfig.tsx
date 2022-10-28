// components
import { UserProfileName } from '../../../app/api/generated';
import { NavConfig } from '../../../components/nav-section';
import SvgIconStyle from '../../../components/SvgIconStyle';
import { PROFILE_TYPE_NAMES } from '../../../constants';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  dashboard: getIcon('dashboard'),
  calendar: getIcon('calendar'),
  user: getIcon('user'),
  attendance: getIcon('attendance'),
  assessment: getIcon('assessment'),
  wellbeing: getIcon('wellbeing'),

  student: getIcon('student'),
  subjectOptions: getIcon('subjectOptions'),
  people: getIcon('people'),
  substitution: getIcon('substitution'),
  payments: getIcon('payments'),
  reporting: getIcon('reporting'),
  integrations: getIcon('integrations'),
  timetable: getIcon('timetable'),
  access: getIcon('access'),
  settings: getIcon('settings'),
};

const availableForAllUsers: UserProfileName[] = [
  PROFILE_TYPE_NAMES.ADMIN,
  PROFILE_TYPE_NAMES.TEACHER,
  PROFILE_TYPE_NAMES.CONTACT,
  PROFILE_TYPE_NAMES.STUDENT
];

const navConfig: NavConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    id: 'general',
    subheader: 'general',
    items: [
      { title: 'Schools', path: '/two', icon: ICONS.dashboard, availableFor: [ PROFILE_TYPE_NAMES.TURO_ADMIN ], },
      { title: 'Dashboard', path: '/one', icon: ICONS.dashboard, availableFor: availableForAllUsers, },
      { title: 'Calendar', path: '/p', icon: ICONS.calendar, availableFor: availableForAllUsers, },
      { title: 'Groups', path: '/a', icon: ICONS.user, availableFor: availableForAllUsers, },
      { title: 'Attendance', path: '/b', icon: ICONS.attendance, availableFor: availableForAllUsers, },
      { title: 'Assessment', path: '/c', icon: ICONS.assessment, availableFor: availableForAllUsers, },
      { title: 'Wellbeing', path: '/d', icon: ICONS.wellbeing, availableFor: [PROFILE_TYPE_NAMES.TEACHER, PROFILE_TYPE_NAMES.ADMIN, PROFILE_TYPE_NAMES.CONTACT]},
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    id: 'managment',
    subheader: 'management',
    //permissions: ['ui:view:admin'],
    items: [
      { title: 'Student', path: '/twofds', icon: ICONS.student, availableFor: [PROFILE_TYPE_NAMES.CONTACT] },
      { title: 'Subject Options', path: '/twofdsfdf', icon: ICONS.subjectOptions, availableFor: [PROFILE_TYPE_NAMES.CONTACT, PROFILE_TYPE_NAMES.STUDENT] },
      { title: 'People', path: '/twofdfsd', icon: ICONS.people, availableFor: [PROFILE_TYPE_NAMES.TEACHER, PROFILE_TYPE_NAMES.ADMIN] },
      { title: 'Substitution', path: '/twukhuj', icon: ICONS.substitution, availableFor: [PROFILE_TYPE_NAMES.TEACHER, PROFILE_TYPE_NAMES.ADMIN] },
      { title: 'Payments', path: '/twoh', icon: ICONS.payments, availableFor: [PROFILE_TYPE_NAMES.CONTACT, PROFILE_TYPE_NAMES.ADMIN] },
      { title: 'Reporting', path: '/twohgfhfg', icon: ICONS.reporting, availableFor: [PROFILE_TYPE_NAMES.ADMIN],
        children: [
          { title: 'User reports', path:'/gfdgfd' },
          { title: 'September returns', path:'/gfdgfdgf' },
          { title: 'Tusla', path:'/gfdggfdfd' },
        ] },
      { title: 'Integrations', path: '/twohgfhf', icon: ICONS.integrations, availableFor: [PROFILE_TYPE_NAMES.ADMIN] },
      { title: 'Timetable', path: '/twohgfhfg', icon: ICONS.timetable, availableFor: [PROFILE_TYPE_NAMES.ADMIN],
        children: [
          { title: 'User reports', path:'/gfdggdfd' },
          { title: 'September returns', path:'/gfdggfdfdgf' },
          { title: 'Tusla', path:'/gfdggfdgfdfd' },
        ]
      },
      { title: 'Access Control', path: '/twohgfhfg', icon: ICONS.access, availableFor: [PROFILE_TYPE_NAMES.ADMIN],
        children: [
          { title: 'User reports', path:'/gfdggdfd' },
          { title: 'September returns', path:'/gfdggfdfdgf' },
          { title: 'Tusla', path:'/gfdggfdgfdfd' },
        ]
      },
      { title: 'Settings', path: '/twohgfgdrhf', icon: ICONS.settings, availableFor: availableForAllUsers, },
    ],
  },
];

export default navConfig;
