import { styled, alpha } from '@mui/material/styles';

export const CalendarStyle = styled('div')(({ theme }) => ({
  width: 'calc(100% + 2px)',
  marginLeft: -1,
  marginBottom: -1,
  'MuiPaper-root': { maxWidth: '752px' },
  '& .fc': {
    '--fc-list-event-dot-width': '8px',
    '--fc-event-text-color': theme.palette.text.primary,
    '--fc-border-color': theme.palette.divider,
    '--fc-event-border-color': theme.palette.info.light,
    '--fc-now-indicator-color': theme.palette.red.main,
    '--fc-today-bg-color': theme.palette.background.default,
    '--fc-page-bg-color': theme.palette.background.default,
    '--fc-neutral-bg-color': theme.palette.background.paper,
    '--fc-list-event-hover-bg-color': theme.palette.action.hover,
    '--fc-highlight-color': alpha(theme.palette.primary.main, 0.08),
    '--fc-non-business-color': theme.palette.slate[50],
  },

  '& .fc .fc-license-message': { display: 'none' },
  '& .fc a': { color: theme.palette.text.primary },

  // Table Head
  '& .fc .fc-col-header ': {
    boxShadow: `inset 0 -1px 0 ${theme.palette.divider}`,

    '& a': {
      color: theme.palette.text.secondary,
      fontWeight: 700,
      '& .today': {
        color: theme.palette.text.primary,
      },
    },
    '& .fc-col-header-cell-cushion': {
      ...theme.typography.subtitle2,
      fontWeight: 700,
      padding: '13px 0',
    },
  },

  // Event
  '& .fc .fc-event': {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  '& .fc .fc-event .fc-event-main': {
    padding: 0,
    borderRadius: 5,
    transition: theme.transitions.create('filter'),
    '&:hover': { filter: 'brightness(0.92)' },
  },
  '& .fc .fc-event .fc-event-main-frame': {
    fontSize: 13,
    filter: 'brightness(0.24)',
    display: 'flex',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  '.fc .fc-timegrid-slot': { height: '3rem' },
  '& .fc .fc-daygrid-event .fc-event-title': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  '& .fc .fc-event .fc-event-time': {
    padding: 0,
    overflow: 'unset',
    fontWeight: theme.typography.fontWeightBold,
  },

  // Popover
  '& .fc .fc-popover': {
    border: 0,
    overflow: 'hidden',
    boxShadow: theme.customShadows.z20,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },
  '& .fc .fc-popover-header': {
    ...theme.typography.subtitle2,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.slate[500_12],
    borderBottom: `solid 1px ${theme.palette.divider}`,
  },
  '& .fc .fc-popover-close': {
    opacity: 0.48,
    transition: theme.transitions.create('opacity'),
    '&:hover': { opacity: 1 },
  },
  '& .fc .fc-more-popover .fc-popover-body': {
    padding: theme.spacing(1.5),
  },
  '& .fc .fc-popover-body': {
    '& .fc-daygrid-event.fc-event-start, & .fc-daygrid-event.fc-event-end': {
      margin: '2px 0',
    },
  },

  // Month View
  '& .fc .fc-day-other .fc-daygrid-day-top': {
    opacity: 1,
    '& .fc-daygrid-day-number': {
      color: theme.palette.text.disabled,
    },
  },
  '& .fc .fc-daygrid-day-number': {
    ...theme.typography.body2,
    margin: theme.spacing(0.5, 0.5, 0),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 28,
    height: 28,
    borderRadius: '50%',
  },
  '& .fc .fc-day-today .fc-daygrid-day-number': {
    backgroundColor: theme.palette.primary.main,
    color: 'white !important',
    justifyContent: 'center',
  },
  '& .fc .fc-daygrid-event': {
    marginTop: 4,
  },
  '& .fc .fc-daygrid-event.fc-event-start, & .fc .fc-daygrid-event.fc-event-end':
    {
      marginLeft: 4,
      marginRight: 4,
    },
  '& .fc .fc-daygrid-more-link': {
    ...theme.typography.caption,
    color: theme.palette.text.secondary,
  },
  '& .fc .fc-daygrid-day.fc-day-today': {
    backgroundColor: 'transparent',
  },
  '& .fc .fc-daygrid-day-bottom': {
    marginLeft: 4,
    marginRight: 4,
  },

  // Week & Day View
  '& .fc .fc-timegrid-event, & .fc .fc-timeline-event': {
    borderRadius: 5,
  },
  '& .fc .fc-timeline-event': {
    padding: 0,
  },
  '& .fc .fc-timegrid-axis-cushion': {
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
  },
  '& .fc .fc-timegrid-slot-label-cushion': {
    ...theme.typography.body2,
  },

  '& .fc .fc-timegrid-slot-label': {
    verticalAlign: 'top',
  },

  // Agenda View
  '& .fc-direction-ltr .fc-list-day-text, .fc-direction-rtl .fc-list-day-side-text, .fc-direction-ltr .fc-list-day-side-text, .fc-direction-rtl .fc-list-day-text':
    {
      ...theme.typography.subtitle2,
    },
  '& .fc .fc-list-event': {
    ...theme.typography.body2,
    '& .fc-list-event-time': {
      color: theme.palette.text.secondary,
    },
  },
  '& .fc .fc-list-table': {
    '& th, td': {
      borderColor: 'transparent',
    },
  },
}));
