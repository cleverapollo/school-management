import { useParams } from 'react-router-dom';
import {
  useNumber,
  usePreferredNameLayout,
  PageHeading,
  Page,
  TabPageContainer,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Container } from '@mui/material';

export default function ClassListManagerContainer() {
  const { t } = useTranslation(['common', 'people', 'navigation']);

  return (
    <Page title={t('navigation:management.classListManager')}>
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <PageHeading title={t('navigation:management.classListManager')} />
        <TabPageContainer
          links={[
            {
              label: 'Class',
              value: 'class',
            },
            {
              label: 'Block',
              value: 'block',
            },
          ]}
        />
      </Container>
    </Page>
  );
}
