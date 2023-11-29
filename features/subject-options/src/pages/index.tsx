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
  usePreferredNameLayout,
  PageContainer,
} from '@tyro/core';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { AddDocIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

// const getColumnDefs = (
//   translate: TFunction<
//     ('assessments' | 'common')[],
//     undefined,
//     ('assessments' | 'common')[]
//   >,
//   displayName: ReturnTypeDisplayName
// ): GridOptions<ReturnTypeFromUseAssessments>['columnDefs'] => [
//   {
//     field: 'name',
//     headerName: translate('common:name'),
//     cellRenderer: ({
//       data,
//     }: ICellRendererParams<ReturnTypeFromUseAssessments>) =>
//       data && (
//         <RouterLink
//           to={getAssessmentSubjectGroupsLink(
//             data.id,
//             data.assessmentType,
//             data.academicNamespaceId
//           )}
//         >
//           {data.name}
//         </RouterLink>
//       ),
//   },
//   {
//     field: 'assessmentType',
//     headerName: translate('common:type'),
//     enableRowGroup: true,
//     valueGetter: ({ data }) =>
//       data?.assessmentType
//         ? translate(`assessments:assessmentTypes.${data.assessmentType}`)
//         : null,
//   },
//   {
//     field: 'createdBy',
//     headerName: translate('common:createdBy'),
//     valueGetter: ({ data }) => (data ? displayName(data.createdBy) : null),
//   },
//   {
//     field: 'startDate',
//     headerName: translate('common:startDate'),
//     valueGetter: ({ data }) =>
//       data ? dayjs(data.startDate).format('LL') : null,
//     sort: 'desc',
//     comparator: (dateA: string, dateB: string) =>
//       dayjs(dateA).unix() - dayjs(dateB).unix(),
//   },
//   {
//     field: 'endDate',
//     headerName: translate('common:endDate'),
//     valueGetter: ({ data }) => (data ? dayjs(data.endDate).format('LL') : null),
//     comparator: (dateA: string, dateB: string) =>
//       dayjs(dateA).unix() - dayjs(dateB).unix(),
//   },
//   {
//     field: 'publishedFrom',
//     headerName: translate('assessments:publishedOnline'),
//     valueGetter: ({ data }) => {
//       if (!data) return null;

//       if (
//         data.publishedFrom &&
//         dayjs(data.publishedFrom).isAfter(dayjs(), 'day')
//       ) {
//         return translate('common:fromDate', {
//           date: dayjs(data.publishedFrom).format('LL'),
//         });
//       }

//       return data.publishedFrom
//         ? translate('common:yes')
//         : translate('common:no');
//     },
//     cellRenderer: ({
//       data,
//     }: ICellRendererParams<ReturnTypeFromUseAssessments>) => {
//       if (!data) return null;

//       if (
//         data.publishedFrom &&
//         dayjs(data.publishedFrom).isAfter(dayjs(), 'day')
//       ) {
//         return translate('common:fromDate', {
//           date: dayjs(data.publishedFrom).format('LL'),
//         });
//       }

//       return <TableBooleanValue value={!!data.publishedFrom} />;
//     },
//   },
// ];

export default function SubjectOptionsPage() {
  const { t } = useTranslation(['navigation', 'subjectOptions']);
  const { displayName } = usePreferredNameLayout();

  // const columnDefs = useMemo(
  //   () => getColumnDefs(t, displayName),
  //   [t, displayName]
  // );

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
      {/* <Table
        rowData={[]}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.id)}
      /> */}
    </PageContainer>
  );
}
