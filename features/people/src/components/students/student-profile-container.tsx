/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import {
  alpha,
  Box,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import { Outlet, useParams, useMatches } from 'react-router-dom';
import {
  Page,
  useNumber,
  Tabs,
  LinkTab,
  Breadcrumbs,
  LazyLoader,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useEffect, useState } from 'react';
import { useStudent } from '../../api/students';
import { StudentOverviewBar } from './student-overview-bar';
import { displayName } from '../../../../../src/utils/nameUtils';

const getStudentTabs = (t: TFunction<'people'[]>) => [
  {
    label: 'Overview',
    value: 'overview',
  },
  {
    label: t('people:personal.title'),
    value: 'personal',
  },
  {
    label: t('people:contacts'),
    value: 'contacts',
  },
  {
    label: 'Attendance',
    value: 'attendance',
  },
  {
    label: 'Fees',
    value: 'fees',
  },
  {
    label: 'Assessment',
    value: 'assessment',
  },
  {
    label: 'Timetable',
    value: 'timetable',
  },
  {
    label: 'Well-being',
    value: 'well-being',
  },
  {
    label: 'SEN',
    value: 'sen',
  },
  {
    label: 'Classes',
    value: 'classes',
  },
  {
    label: 'Settings',
    value: 'settings',
  },
];

function getInitialTabValue(
  matches: ReturnType<typeof useMatches>,
  studentTabs: ReturnType<typeof getStudentTabs>
) {
  const lastUrl = matches[matches.length - 1].pathname;

  const matchedPathname = studentTabs.find(({ value }) =>
    lastUrl.endsWith(value)
  );
  return matchedPathname?.value ?? 'overview';
}

export default function StudentProfileContainer() {
  const matches = useMatches();
  const { t } = useTranslation(['navigation', 'people']);
  const studentTabs = getStudentTabs(t);
  const [value, setValue] = useState<string>(
    getInitialTabValue(matches, studentTabs)
  );
  const { id } = useParams();
  const idNumber = useNumber(id);
  const { data } = useStudent(idNumber);
  const name = displayName(data?.person);

  useEffect(() => {
    setValue(getInitialTabValue(matches, studentTabs));
  }, [matches, studentTabs]);

  return (
    <Page
      title={t('people:usersProfile', { name })}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        px: 0,
        minHeight: '100%',
      }}
    >
      <Box sx={{ maxWidth: '100vw', px: 2 }}>
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="h4" component="h1">
            {t('people:usersProfile', { name })}
          </Typography>
          <Breadcrumbs
            links={[
              {
                name: t('people:students'),
                href: './..',
              },
              {
                name: t('people:usersProfile', { name }),
              },
            ]}
          />
          <StudentOverviewBar studentId={idNumber} />
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={value}
              onChange={(event, newValue: string) => {
                setValue(newValue);
              }}
            >
              {studentTabs.map((tab) => (
                <LinkTab key={tab.value} {...tab} to={`./${tab.value}`} />
              ))}
            </Tabs>
          </Box>
        </Container>
      </Box>
      <Box
        sx={({ isLight, palette }) => ({
          backgroundColor: alpha(
            isLight ? palette.slate[100] : palette.slate[800],
            0.6
          ),
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          flex: 1,
          px: 2,
          position: 'relative',
        })}
      >
        <Container maxWidth="xl">
          <LazyLoader
            fallback={
              <Box
                sx={{
                  display: 'flex',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <Outlet />
          </LazyLoader>
        </Container>
      </Box>
    </Page>
  );
}
