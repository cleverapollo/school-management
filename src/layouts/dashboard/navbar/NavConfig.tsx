// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    id: 'general',
    subheader: '',
    items: [
      { title: 'Timetable', path: '/one', icon: ICONS.dashboard , roles: ["ui:view:timetable"]},
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    id: 'management',
    subheader: 'management',
    roles: ['ui:view:admin'],
    items: [
      { title: 'Class List Manager', path: '/two', icon: ICONS.ecommerce },
    ],
  },
  {
    id: 'bottom',
    subheader: '',
    items: [
      {
        title: 'Account',
        path: '/user/account',
        icon: ICONS.user,
      },
    ],
  },
];

export default navConfig;
