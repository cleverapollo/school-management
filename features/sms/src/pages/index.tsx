import { PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

export default function SmsList() {
  const { t } = useTranslation(['navigation']);

  return (
    <PageContainer title={t('navigation:management.sms')}>
      <PageHeading
        title={t('navigation:management.sms')}
        titleProps={{ variant: 'h3' }}
      />
      {/* <Table
        rowData={assessmentsData || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.id)}
      /> */}
    </PageContainer>
  );
}
