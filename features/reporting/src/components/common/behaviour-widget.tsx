import { Card, IconButton, Stack, Typography } from '@mui/material';
import { FullScreenIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { useTranslation, Trans } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import {
  Avatar,
  DateDropdownPicker,
  LoadingPlaceholderContainer,
} from '@tyro/core';
import { useState } from 'react';
import { useRunReports } from '../../api/run-report';
import { getReportUrl, Report } from '../../utils/get-report-url';
import { useReportFormatValues } from '../../hooks/use-report-format-values';

export function BehaviourWidget() {
  const { t } = useTranslation(['common', 'reports']);
  const [date, setDate] = useState(dayjs());
  const dateString = date.format('YYYY-MM-DD');

  const { data: behaviourData, isLoading } = useRunReports({
    topReportId: Report.STUDENT_BEHAVIOUR,
    filter: {
      reportId: Report.STUDENT_BEHAVIOUR,
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

  const { mapField } = useReportFormatValues();

  const behaviourStudents = mapField<
    | 'id'
    | 'avatar_url'
    | 'party_id'
    | 'first_name'
    | 'last_name'
    | 'class'
    | 'created_by'
    | 'tags'
    | 'category'
    | 'date'
  >(behaviourData, { limitData: 5 });

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
              party_id: partyId,
              avatar_url: avatarUrl,
              first_name,
              last_name,
              class: classGroup,
              created_by: createdBy,
              tags,
              category,
              date: loggedDate,
            }) => {
              const name = [first_name?.textValue, last_name?.textValue].join(
                ' '
              );

              const loggedTime = dayjs(loggedDate?.rawValue as string).format(
                'LT'
              );

              return (
                <Card
                  component={Link}
                  key={id.textValue}
                  to={`/people/students/${partyId?.textValue}/behaviour`}
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
                        <Avatar
                          name={name}
                          src={avatarUrl?.textValue}
                          size={48}
                        />
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
                            {classGroup?.textValue}
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
                            {{ createdBy: createdBy?.textValue }}
                          </Typography>
                        </Trans>
                      </Typography>
                    </Stack>
                    <Stack direction="row" flex={1} spacing={0.75}>
                      {category?.renderedValue}
                      {tags?.renderedValue}
                    </Stack>
                  </Stack>
                </Card>
              );
            }
          )}
        </Stack>
      )}
    </Card>
  );
}
