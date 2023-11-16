import { Card, IconButton, Stack, Typography, Chip } from '@mui/material';
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

type ReportColumnValue = {
  value: string;
};

type BehaviourData = {
  date: ReportColumnValue;
  associated_parties: ReportColumnValue;
  last_name: ReportColumnValue;
  details: ReportColumnValue;
  id: ReportColumnValue;
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
  const { data: behaviourData, isLoading } = useRunReports({
    topReportId: 'student-behaviour',
    filter: {
      reportId: 'student-behaviour',
      filters: [
        {
          filterId: 'from_date',
          filterValue: date.format('YYYY-MM-DD'),
        },
        {
          filterId: 'to_date',
          filterValue: date.add(1, 'day').format('YYYY-MM-DD'),
        },
      ],
    },
  });

  const behaviourStudents = useMemo(() => {
    const behaviourStudentsData = (behaviourData?.data ?? []) as BehaviourData;

    return behaviourStudentsData.slice(0, 5).map((behaviourStudent) => ({
      id: behaviourStudent.id.value,
      name: `${behaviourStudent.first_name.value} ${behaviourStudent.last_name.value}`,
      loggedDate: behaviourStudent.date.value,
      tags: behaviourStudent.tags.value,
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
            to="/reports/student-behaviour/student-behaviour"
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
              name,
              classGroup,
              createdBy = '-',
              tags,
              category,
              categoryColour,
              loggedDate,
            }) => (
              <Card
                component={Stack}
                key={id}
                sx={{
                  p: 1.5,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Stack direction="row">
                    <Avatar name={name} size={36} />
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
                    variant="body1"
                    color="text.secondary"
                    component="span"
                  >
                    <Trans ns="reports" i18nKey="loggedDateByStaff">
                      Logged {{ loggedDate }} <br />
                      by {{ createdBy }}
                    </Trans>
                  </Typography>
                </Stack>
                <Stack flex={1} alignItems="flex-start">
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="span"
                  >
                    {tags}
                  </Typography>
                  {category && (
                    <Chip
                      size="small"
                      variant="soft"
                      color={categoryColour ?? 'slate'}
                      label={category}
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </Stack>
              </Card>
            )
          )}
        </Stack>
      )}
    </Card>
  );
}
