import { Container } from '@mui/material';
import { Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { PartyAutocomplete } from '@tyro/party';
import { PartyOption } from '@tyro/party/src/api/search';
import * as React from 'react';
import { useState } from 'react';
import { Calendar } from '../../components/common/calendar/calendar';

export default function CalendarPage() {
  const { t } = useTranslation(['calendar']);
  const [partyId, setPartyId] = useState<number | undefined>(undefined);
  return (
    <Page title={t('calendar:calendar')}>
      <PartyAutocomplete
        // @ts-expect-error
        onChange={(
          event: React.SyntheticEvent,
          newValue: PartyOption | null
        ) => {
          setPartyId(newValue?.id);
        }}
        label="Find Timetables"
      />
      <Container maxWidth="xl">
        <Calendar partyId={partyId} />
      </Container>
    </Page>
  );
}
