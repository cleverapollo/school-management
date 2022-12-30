// components
import { UserProfileName } from '../../../app/api/generated';
import { NavConfig } from '../../../components/nav-section';
import SvgIconStyle from '../../../components/SvgIconStyle';
import {UserType} from "@tyro/api";

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
  UserType.Admin,
    UserType.Teacher,
    UserType.Contact,
    UserType.Student
];

const navConfig: NavConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    id: 'general',
    subheader: 'general',
    items: [
      { title: 'schools', path: '/admin/schools', icon: ICONS.school, availableFor: [ UserType.Tyro ], },
      { title: 'dashboard', path: '/one', icon: ICONS.dashboard, availableFor: availableForAllUsers, },
      { title: 'calendar', path: '/calendar', icon: ICONS.calendar, availableFor: availableForAllUsers, },
      {
        title: 'groups', path: '/groups', icon: ICONS.user, availableFor: [UserType.Teacher, UserType.Admin],
        children: [
          { title: 'Enrolment', path: '/groups/enrolment' },
          { title: 'Subject', path: '/groups/subject' },
          { title: 'Custom', path: '/groups/custom' },
        ]
      },
      { title: 'subjects', path: '/subjects', icon: ICONS.subjects, availableFor: [ UserType.Contact, UserType.Student ]},
      { title: 'attendance', path: '/b', icon: ICONS.attendance, availableFor: availableForAllUsers, },
      { title: 'assessment', path: '/c', icon: ICONS.assessment, availableFor: availableForAllUsers, },
      { title: 'wellbeing', path: '/d', icon: ICONS.wellbeing, availableFor: [ UserType.Teacher, UserType.Admin, UserType.Contact ]},
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    id: 'managment',
    subheader: 'management',
    //permissions: ['ui:view:admin'],
    items: [
      { title: 'student', path: '/twofds', icon: ICONS.student, availableFor: [UserType.Contact] },
      { title: 'subject options', path: '/twofdsfdf', icon: ICONS.subjectOptions, availableFor: [UserType.Contact, UserType.Student] },
      { title: 'people', path: '/twofdfsd', icon: ICONS.people, availableFor: [UserType.Teacher, UserType.Admin] },
      { title: 'substitution', path: '/twukhuj', icon: ICONS.substitution, availableFor: [UserType.Teacher, UserType.Admin] },
      { title: 'payments', path: '/twoh', icon: ICONS.payments, availableFor: [UserType.Contact, UserType.Admin] },
      { title: 'reporting', path: '/twohgfhfg', icon: ICONS.reporting, availableFor: [UserType.Admin],
        children: [
          { title: 'user reports', path:'/gfdgfd' },
          { title: 'september returns', path:'/gfdgfdgf' },
          { title: 'tusla', path:'/gfdggfdfd' },
        ] },
      { title: 'integrations', path: '/twohgfhf', icon: ICONS.integrations, availableFor: [UserType.Admin] },
      { title: 'timetable', path: '/twohgfhfg', icon: ICONS.timetable, availableFor: [UserType.Admin],
        children: [
          { title: 'user reports', path:'/gfdggdfd' },
          { title: 'september returns', path:'/gfdggfdfdgf' },
          { title: 'tusla', path:'/gfdggfdgfdfd' },
        ]
      },
      { title: 'access control', path: '/twohgfhfg', icon: ICONS.access, availableFor: [UserType.Admin],
        children: [
          { title: 'user reports', path:'/gfdggdfd' },
          { title: 'september returns', path:'/gfdggfdfdgf' },
          { title: 'tusla', path:'/gfdggfdgfdfd' },
        ]
      },
      { title: 'settings', path: '/general-settings', icon: ICONS.settings, availableFor: [UserType.Admin],
          children: [
              { title: 'rooms', path:'general-settings/rooms' },
              { title: 'namespaces', path: 'general-settings/academic-namespaces', }
          ]
      },
    ],
  },
];

export default navConfig;
