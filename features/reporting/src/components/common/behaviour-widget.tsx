import { Card, IconButton, Stack, Typography, Chip, Box } from '@mui/material';
import { FullScreenIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { useTranslation, Trans } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import {
  Avatar,
  DateDropdownPicker,
  LoadingPlaceholderContainer,
} from '@tyro/core';
import { useMemo, useState } from 'react';
import { Colour } from '@tyro/api';
import { useRunReports } from '../../api/run-report';
import { getReportUrl, Report } from '../../utils/get-report-url';

type ReportColumnValue = {
  value: string;
};

type BehaviourData = {
  date: ReportColumnValue;
  indicate_date: ReportColumnValue;
  associated_parties: ReportColumnValue;
  last_name: ReportColumnValue;
  details: ReportColumnValue;
  id: ReportColumnValue;
  avatar_url?: ReportColumnValue;
  party_id: ReportColumnValue;
  type: ReportColumnValue;
  first_name: ReportColumnValue;
  class?: ReportColumnValue;
  created_by: ReportColumnValue;
  tags: ReportColumnValue;
  category?: ReportColumnValue;
  category_colour?: {
    value: Colour;
  };
}[];

export function BehaviourWidget() {
  const { t } = useTranslation(['common', 'reports']);
  const [date, setDate] = useState(dayjs());
  const dateString = date.format('YYYY-MM-DD');
  const { data: behaviourData, isLoading } = useRunReports({
    topReportId: 'student-behaviour',
    filter: {
      reportId: 'student-behaviour',
      filters: [
        {
          filterId: 'from_date',
          filterValue: dateString,
        },
        {
          filterId: 'to_date',
          filterValue: dateString,
        },
      ],
    },
  });

  const behaviourStudents = useMemo(() => {
    const behaviourStudentsData = (behaviourData?.data ?? []) as BehaviourData;

    return behaviourStudentsData.slice(0, 5).map((behaviourStudent) => ({
      id: behaviourStudent.id.value,
      name: `${behaviourStudent.first_name.value} ${behaviourStudent.last_name.value}`,
      partyId: behaviourStudent.party_id.value,
      avatarUrl: behaviourStudent?.avatar_url?.value,
      loggedTime: dayjs(behaviourStudent.indicate_date.value).format('LT'),
      tags: behaviourStudent.tags.value.split(','),
      classGroup: behaviourStudent.class?.value,
      createdBy: behaviourStudent?.created_by?.value,
      category: behaviourStudent?.category?.value,
      categoryColour: behaviourStudent?.category_colour?.value,
      type: behaviourStudent.type.value,
    }));
  }, [behaviourData]);

  return (
    <Card
      variant="soft"
      sx={{
        flex: 1,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pl={1}
        mb={1}
      >
        <Typography variant="h6" component="span">
          {t('reports:behaviour')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <DateDropdownPicker
            date={date}
            onChangeDate={setDate}
            ButtonProps={{
              size: 'small',
            }}
          />
          <IconButton
            component={Link}
            to={getReportUrl({
              report: Report.STUDENT_BEHAVIOUR,
              filters: {
                from_date: date,
                to_date: date,
              },
            })}
          >
            <FullScreenIcon
              sx={{ width: 20, height: 20, color: 'primary.main' }}
            />
          </IconButton>
        </Stack>
      </Stack>
      {isLoading || behaviourStudents.length === 0 ? (
        <Card
          sx={{
            minHeight: 160,
          }}
        >
          <LoadingPlaceholderContainer isLoading={isLoading}>
            <Stack
              sx={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h2" component="span">
                👍
              </Typography>
              <Typography
                variant="body1"
                component="span"
                color="text.secondary"
              >
                {t('reports:noBehaviourEventsToday')}
              </Typography>
            </Stack>
          </LoadingPlaceholderContainer>
        </Card>
      ) : (
        <Stack spacing={1.25}>
          {behaviourStudents.map(
            ({
              id,
              partyId,
              avatarUrl,
              name,
              classGroup,
              createdBy = '-',
              tags,
              category,
              categoryColour,
              loggedTime,
            }) => (
              <Card
                component={Link}
                key={id}
                to={`/people/students/${partyId}/behaviour`}
                sx={{
                  p: 1.5,
                  textDecoration: 'inherit',
                  '&:hover': {
                    bgcolor: 'indigo.100',
                  },
                  '&:active': {
                    bgcolor: 'indigo.200',
                  },
                }}
              >
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1.5}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar name={name} src={avatarUrl} size={48} />
                      <Stack>
                        <Typography variant="subtitle1" component="span">
                          {name}
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="text.secondary"
                          component="span"
                        >
                          {classGroup}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                      textAlign="right"
                    >
                      <Trans ns="reports" i18nKey="loggedDateByStaff">
                        Logged at {{ loggedTime }} <br />
                        by{' '}
                        <Typography
                          variant="body2"
                          component="span"
                          fontWeight="600"
                          color="text.primary"
                        >
                          {/* @ts-expect-error */}
                          {{ createdBy }}
                        </Typography>
                      </Trans>
                    </Typography>
                  </Stack>
                  <Stack direction="row" flex={1} spacing={0.75}>
                    {category && (
                      <Chip
                        size="small"
                        variant="outlined"
                        color={categoryColour ?? 'slate'}
                        label={category}
                      />
                    )}
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        size="small"
                        variant="soft"
                        color={categoryColour ?? 'slate'}
                        label={tag}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Card>
            )
          )}
        </Stack>
      )}
    </Card>
  );
}
