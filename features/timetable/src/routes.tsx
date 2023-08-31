import { lazyWithRetry, NavObjectFunction, NavObjectType } from '@tyro/core';
import { EditCalendarIcon } from '@tyro/icons';
import { getYearGroups } from '@tyro/groups';
import { redirect } from 'react-router-dom';
import { getLiveTimetableId, getTimetables } from './api/common/timetables';
import { getTimetableResourceView } from './api/edit-timetable/resource-view';
import { getTimetableSubjectGroups } from './api/edit-timetable/subject-groups';

// const TimetableList = lazyWithRetry(() => import('./pages/index'));
// const ViewTimetable = lazyWithRetry(() => import('./pages/view'));

const EditTimetableContainer = lazyWithRetry(
  () => import('./components/edit-timetable-container')
);
const Timetable = lazyWithRetry(
  () => import('./pages/edit-timetable/timetable')
);
const TimetableSubjectGroups = lazyWithRetry(
  () => import('./pages/edit-timetable/subject-groups')
);

export const getRoutes: NavObjectFunction = (t) => [
  {
    type: NavObjectType.Category,
    title: t('navigation:management.title'),
    children: [
      {
        type: NavObjectType.RootGroup,
        icon: <EditCalendarIcon />,
        title: t('navigation:management.timetable.title'),
        path: 'timetable',
        hasAccess: (permissions) =>
          permissions.hasPermission(
            'ps:1:timetable_construction:view_timetable_edit'
          ),
        children: [
          // {
          //   type: NavObjectType.MenuLink,
          //   title: t('navigation:management.timetable.timetables'),
          //   path: 'timetables',
          //   loader: async () => getTimetableLesson(),
          //   element: <TimetableList />,
          // },
          // {
          //   type: NavObjectType.NonMenuLink,
          //   path: ':timetableId',
          //   loader: ({ params }) => {
          //     const timetableId = getNumber(params?.timetableId);
          //     if (!timetableId) {
          //       throw404Error();
          //     }
          //     return getTimetables(timetableId);
          //   },
          //   element: <ViewTimetable />,
          // },
          {
            type: NavObjectType.MenuLink,
            title: t('navigation:management.timetable.editTimetable'),
            path: 'edit-timetable',
            element: <EditTimetableContainer />,
            loader: () => getLiveTimetableId(),
            children: [
              {
                type: NavObjectType.NonMenuLink,
                index: true,
                loader: () => redirect('./timetable'),
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'timetable',
                loader: async () => {
                  const [liveTimetableId, yearGroups] = await Promise.all([
                    getLiveTimetableId(),
                    getYearGroups(),
                  ]);
                  const sixthYearGroup =
                    yearGroups.core_yearGroupEnrollments.find(
                      ({ yearGroupId }) => yearGroupId === 6
                    );

                  if (liveTimetableId && sixthYearGroup) {
                    return getTimetableResourceView({
                      timetableId: liveTimetableId,
                      partyIds: [sixthYearGroup.yearGroupEnrollmentPartyId],
                      roomIds: [],
                    });
                  }

                  return null;
                },
                element: <Timetable />,
              },
              {
                type: NavObjectType.NonMenuLink,
                path: 'subject-groups',
                loader: async () => {
                  const liveTimetableId = await getLiveTimetableId();
                  return liveTimetableId
                    ? getTimetableSubjectGroups({
                        timetableId: liveTimetableId,
                      })
                    : null;
                },
                element: <TimetableSubjectGroups />,
              },
            ],
          },
        ],
      },
    ],
  },
];
