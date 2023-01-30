import { Box, Container, Typography } from '@mui/material';
import { Outlet, useParams, useMatches } from 'react-router-dom';
import { Page, useNumber, Tabs, LinkTab } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Breadcrumbs } from '@tyro/core/src/components';
import { useState } from 'react';
import { useStudent } from '../../api/students';
import { StudentOverviewBar } from './student-overview-bar';

const studentTabs = [
  {
    label: 'Overview',
    value: 'overview',
  },
  {
    label: 'Personal',
    value: 'personal',
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

function getInitialTabValue(matches: ReturnType<typeof useMatches>) {
  const lastUrl = matches[matches.length - 1].pathname;
  const matchedPathname = studentTabs.find(({ value }) =>
    lastUrl.endsWith(value)
  );
  return matchedPathname?.value ?? 'overview';
}

export default function StudentProfileContainer() {
  const matches = useMatches();
  const [value, setValue] = useState<string>(getInitialTabValue(matches));
  const { id } = useParams();
  const idNumber = useNumber(id);
  const { t } = useTranslation(['navigation', 'people']);
  const { data, isLoading } = useStudent(idNumber);
  const name = `${data?.person?.firstName ?? ''} ${
    data?.person?.lastName ?? ''
  }`;

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
      <Box sx={{ px: 2 }}>
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
        </Container>
      </Box>

      <Box
        sx={{
          backgroundColor: 'slate.100',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          flex: 1,
          px: 2,
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Page>
  );
}
