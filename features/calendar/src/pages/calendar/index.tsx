import { Container } from '@mui/material';
import { Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { PartyAutocomplete } from '@tyro/party';
import { PartyType } from '@tyro/api';
import { PartyOption } from '@tyro/party/src/api/search';
import * as React from 'react';
import Calendar from '../../components/Calendar';

export default function CalendarPage() {
  const { t } = useTranslation(['calendar']);

  return (
    <Page title={t('calendar:calendar')}>
      <PartyAutocomplete
        // @ts-ignore
        onChange={(
          event: React.SyntheticEvent,
          newValue: PartyOption | null
        ) => {
          console.log(event);
          console.log(newValue?.id);
        }}
        label="Find Timetables"
      />
      <Container maxWidth="xl">
        <Calendar />
      </Container>
    </Page>
  );
}
