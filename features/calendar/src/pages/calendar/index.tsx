import { Container } from '@mui/material';
import { Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { PartySearchBox } from '@tyro/party';
import { PartyType } from '@tyro/api';
import { PartyOption } from '@tyro/party/src/api/search';
import Calendar from '../../components/Calendar';

export default function CalendarPage() {
  const { t } = useTranslation(['calendar']);

  return (
    <Page title={t('calendar:calendar')}>
      <PartySearchBox
        filterPartyTypes={[PartyType.Student]}
        // @ts-ignore
        onChange={(event: any, newValue: PartyOption | null) => {
          console.log(event);
          console.log(newValue);
        }}
        label="Find Timetables"
      />
      <Container maxWidth="xl">
        <Calendar />
      </Container>
    </Page>
  );
}
