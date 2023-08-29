import { useTranslation } from '@tyro/i18n';
import {
  PageHeading,
  PageContainer,
  RHFTextField,
  RHFAutocomplete,
} from '@tyro/core';
import { Card, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { CalendarParty, useParticipantsSearchProps } from '@tyro/calendar';

interface FormValues {
  name: string;
  staticMembers: CalendarParty[];
}

const textFieldStyle = {
  maxWidth: 300,
  width: '100%',
};

export default function CreateCustomGroupPage() {
  const { t } = useTranslation(['common', 'groups']);

  const { control, handleSubmit } = useForm<FormValues>({});
  const participantsProps = useParticipantsSearchProps({
    label: t('groups:staticMembers'),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <PageContainer title={t('groups:createCustomGroup')}>
      <PageHeading
        title={t('groups:createCustomGroup')}
        breadcrumbs={{
          links: [
            {
              name: t('groups:customGroups'),
              href: '../',
            },
            {
              name: t('groups:createCustomGroup'),
            },
          ],
        }}
      />
      <Card variant="outlined" component="form" onSubmit={onSubmit}>
        <Stack direction="column" gap={3} p={3}>
          <Stack direction="column" gap={2.5}>
            <Typography variant="subtitle1" color="text.secondary">
              {t('common:details')}
            </Typography>
            <Stack direction="row" gap={2}>
              <RHFTextField<FormValues>
                label={t('groups:groupName')}
                textFieldProps={{ sx: textFieldStyle }}
                controlProps={{
                  name: 'name',
                  control,
                }}
              />
            </Stack>
          </Stack>
          <Stack direction="column" gap={2.5}>
            <Typography variant="subtitle1" color="text.secondary">
              {t('common:members')}
            </Typography>
            <Stack direction="row" gap={2}>
              <RHFAutocomplete<FormValues, CalendarParty, true>
                {...participantsProps}
                controlProps={{
                  name: 'staticMembers',
                  control,
                }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </PageContainer>
  );
}
