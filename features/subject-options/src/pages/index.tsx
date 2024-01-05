import { useMemo } from 'react';
import { Box, Button } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  ICellRendererParams,
  PageHeading,
  ReturnTypeDisplayName,
  RouterLink,
  Table,
  TableBooleanValue,
  PageContainer,
} from '@tyro/core';
import { Link } from 'react-router-dom';
import { AddDocIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  ReturnTypeFromUseOptionsSetupList,
  useOptionsSetupList,
} from '../api/options';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<
    ('subjectOptions' | 'common')[],
    undefined,
    ('subjectOptions' | 'common')[]
  >
): GridOptions<ReturnTypeFromUseOptionsSetupList>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    // cellRenderer: ({
    //   data,
    // }: ICellRendererParams<ReturnTypeFromUseOptionsSetupList>) =>
    //   data && (
    //     <RouterLink
    //       to={getAssessmentSubjectGroupsLink(
    //         data.id,
    //         data.assessmentType,
    //         data.academicNamespaceId
    //       )}
    //     >
    //       {data.name}
    //     </RouterLink>
    //   ),
  },
  {
    field: 'yearGroupEnrolmentParty.name',
    headerName: t('subjectOptions:yearGroupFor'),
  },
  {
    field: 'publishToParents',
    headerName: t('subjectOptions:publishedToParents'),
    valueGetter: ({ data }) => {
      if (!data) return null;

      return data.publishToParents ? t('common:yes') : t('common:no');
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseOptionsSetupList>) => {
      if (!data) return null;

      return <TableBooleanValue value={data.publishToParents} />;
    },
  },
];

export default function SubjectOptionsPage() {
  const { t } = useTranslation(['navigation', 'common', 'subjectOptions']);

  const { data: optionsSetupList = [] } = useOptionsSetupList({});

  const columnDefs = useMemo(() => getColumnDefs(t), [t]);

  return (
    <PageContainer title={t('navigation:management.subjectOptions')}>
      <PageHeading
        title={t('navigation:management.subjectOptions')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              component={Link}
              to="./create"
              startIcon={<AddDocIcon />}
            >
              {t('subjectOptions:createSubjectOptions')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={optionsSetupList}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.id)}
      />
    </PageContainer>
  );
}
