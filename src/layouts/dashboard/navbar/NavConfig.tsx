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
  school: getIcon('school'),
  dashboard: getIcon('dashboard'),
  calendar: getIcon('calendar'),
  user: getIcon('user'),
  attendance: getIcon('attendance'),
  assessment: getIcon('assessment'),
  wellbeing: getIcon('wellbeing'),
  subjects: getIcon('subjects'),

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
      { title: 'schools', path: '/admin/schools', icon: ICONS.school, availableFor: [ PROFILE_TYPE_NAMES.TYRO ], },
      { title: 'dashboard', path: '/one', icon: ICONS.dashboard, availableFor: availableForAllUsers, },
      { title: 'calendar', path: '/p', icon: ICONS.calendar, availableFor: availableForAllUsers, },
      {
        title: 'groups', path: '/groups', icon: ICONS.user, availableFor: [PROFILE_TYPE_NAMES.TEACHER, PROFILE_TYPE_NAMES.ADMIN],
        children: [
          { title: 'Enrolment', path: '/enrolment' },
          { title: 'Subject', path: '/subject' },
          { title: 'Custom', path: '/custom' },
        ]
      },
      { title: 'subjects', path: '/subjects', icon: ICONS.subjects, availableFor: [ PROFILE_TYPE_NAMES.CONTACT, PROFILE_TYPE_NAMES.STUDENT ]},
      { title: 'attendance', path: '/b', icon: ICONS.attendance, availableFor: availableForAllUsers, },
      { title: 'assessment', path: '/c', icon: ICONS.assessment, availableFor: availableForAllUsers, },
      { title: 'wellbeing', path: '/d', icon: ICONS.wellbeing, availableFor: [ PROFILE_TYPE_NAMES.TEACHER, PROFILE_TYPE_NAMES.ADMIN, PROFILE_TYPE_NAMES.CONTACT ]},
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    id: 'managment',
    subheader: 'management',
    //permissions: ['ui:view:admin'],
    items: [
      { title: 'student', path: '/twofds', icon: ICONS.student, availableFor: [PROFILE_TYPE_NAMES.CONTACT] },
      { title: 'subject options', path: '/twofdsfdf', icon: ICONS.subjectOptions, availableFor: [PROFILE_TYPE_NAMES.CONTACT, PROFILE_TYPE_NAMES.STUDENT] },
      { title: 'people', path: '/twofdfsd', icon: ICONS.people, availableFor: [PROFILE_TYPE_NAMES.TEACHER, PROFILE_TYPE_NAMES.ADMIN] },
      { title: 'substitution', path: '/twukhuj', icon: ICONS.substitution, availableFor: [PROFILE_TYPE_NAMES.TEACHER, PROFILE_TYPE_NAMES.ADMIN] },
      { title: 'payments', path: '/twoh', icon: ICONS.payments, availableFor: [PROFILE_TYPE_NAMES.CONTACT, PROFILE_TYPE_NAMES.ADMIN] },
      { title: 'reporting', path: '/twohgfhfg', icon: ICONS.reporting, availableFor: [PROFILE_TYPE_NAMES.ADMIN],
        children: [
          { title: 'user reports', path:'/gfdgfd' },
          { title: 'september returns', path:'/gfdgfdgf' },
          { title: 'tusla', path:'/gfdggfdfd' },
        ] },
      { title: 'integrations', path: '/twohgfhf', icon: ICONS.integrations, availableFor: [PROFILE_TYPE_NAMES.ADMIN] },
      { title: 'timetable', path: '/twohgfhfg', icon: ICONS.timetable, availableFor: [PROFILE_TYPE_NAMES.ADMIN],
        children: [
          { title: 'user reports', path:'/gfdggdfd' },
          { title: 'september returns', path:'/gfdggfdfdgf' },
          { title: 'tusla', path:'/gfdggfdgfdfd' },
        ]
      },
      { title: 'access control', path: '/twohgfhfg', icon: ICONS.access, availableFor: [PROFILE_TYPE_NAMES.ADMIN],
        children: [
          { title: 'user reports', path:'/gfdggdfd' },
          { title: 'september returns', path:'/gfdggfdfdgf' },
          { title: 'tusla', path:'/gfdggfdgfdfd' },
        ]
      },
      { title: 'settings', path: '/twohgfgdrhf', icon: ICONS.settings, availableFor: availableForAllUsers, },
    ],
  },
];

export default navConfig;
