import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@mui/material';
import { PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { MailSidebar } from '../components/sidebar';
import MailList from '../components/list';
import { MailView } from '../components/view';

export default function Mail() {
  const { t } = useTranslation(['mail', 'navigation']);
  const { mailId } = useParams();

  return (
    <PageContainer title={t('mail:mail')}>
      <PageHeading title={t('mail:mail')} titleProps={{ variant: 'h3' }} />
      <Card
        sx={{
          minHeight: 480,
          height: { md: '72vh' },
          display: { md: 'flex' },
        }}
      >
        <MailSidebar />
        {mailId ? <MailView /> : <MailList />}
      </Card>
    </PageContainer>
  );
}
