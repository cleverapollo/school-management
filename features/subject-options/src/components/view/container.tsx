import { useParams } from 'react-router-dom';
import {
  useNumber,
  PageHeading,
  TabPageContainer,
  PageContainer,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useOptionsSetupList } from '../../api/options';

export default function OptionsViewContainer() {
  const { t } = useTranslation(['common', 'navigation', 'subjectOptions']);
  const { id } = useParams();
  const idNumber = useNumber(id);

  const { data: options = [] } = useOptionsSetupList({ ids: [idNumber ?? 0] });
  const { name } = options[0] ?? {};

  return (
    <PageContainer title={name} maxWidth={false} sx={{ maxWidth: 1980 }}>
      <PageHeading
        title={name}
        breadcrumbs={{
          links: [
            {
              name: t('navigation:management.subjectOptions'),
              href: '/subject-options',
            },
            {
              name,
            },
          ],
        }}
      />
      <TabPageContainer
        links={[
          {
            label: t('subjectOptions:preferences'),
            value: 'preferences',
          },
          {
            label: t('subjectOptions:stats'),
            value: 'stats',
          },
          {
            label: t('common:solve'),
            value: 'solve',
            hasAccess: ({ hasPermission }) =>
              hasPermission('ps:1:options:options_beta_test'),
          },
          {
            label: t('subjectOptions:classLists'),
            value: 'class-lists',
            hasAccess: ({ hasPermission }) =>
              hasPermission('ps:1:options:options_beta_test'),
          },
        ]}
      />
    </PageContainer>
  );
}
