import { useParams } from 'react-router-dom';
import {
  useNumber,
  PageHeading,
  TabPageContainer,
  PageContainer,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useFees } from '../../api/fees';

export default function FeeViewContainer() {
  const { t } = useTranslation(['common', 'fees']);

  const { id } = useParams();
  const idNumber = useNumber(id);
  const { data: fees } = useFees({
    ids: [idNumber ?? 0],
  });
  const [fee] = fees || [];
  // Get fee details for title
  // const { data: studentData } = useStudent(idNumber);
  const feeName = fee?.name ?? '';

  return (
    <PageContainer title={feeName}>
      <PageHeading
        title={feeName}
        breadcrumbs={{
          links: [
            {
              name: t('fees:fees'),
              href: '/fees/overview',
            },
            {
              name: feeName,
            },
          ],
        }}
      />
      <TabPageContainer
        links={[
          {
            label: t('common:overview'),
            value: 'overview',
          },
        ]}
      />
    </PageContainer>
  );
}
