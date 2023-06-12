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
  ProcessingDataPlaceholder,
} from '@tyro/core';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { AddDocIcon } from '@tyro/icons';
import { useAcademicNamespace, UseQueryReturnType } from '@tyro/api';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useAssessments } from '../api/assessments';
import { AcademicYearDropdown } from '../components/list-assessments/academic-year-dropdown';
import { getAssessmentSubjectGroupsLink } from '../utils/get-assessment-subject-groups-link';
import { AssessmentActionMenu } from '../components/list-assessments/assessment-action-menu';

dayjs.extend(LocalizedFormat);

// type ReturnTypeFromUseAssessments = UseQueryReturnType<
//   typeof useAssessments
// >[number];

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
//     field: 'dateOfCreation',
//     headerName: translate('common:dateOfCreation'),
//     valueGetter: ({ data }) =>
//       data ? dayjs(data.createdOn).format('LL') : null,
//     sort: 'desc',
//     comparator: (dateA: string, dateB: string) =>
//       dayjs(dateA).unix() - dayjs(dateB).unix(),
//   },
//   {
//     field: 'publish',
//     headerName: translate('assessments:publishedOnline'),
//     valueGetter: ({ data }) =>
//       data?.publish ? translate('common:yes') : translate('common:no'),
//     cellRenderer: ({
//       data,
//     }: ICellRendererParams<ReturnTypeFromUseAssessments>) =>
//       data && <TableBooleanValue value={!!data?.publish} />,
//   },
//   {
//     suppressColumnsToolPanel: true,
//     sortable: false,
//     cellClass: 'ag-show-on-row-interaction',
//     cellRenderer: ({
//       data,
//     }: ICellRendererParams<ReturnTypeFromUseAssessments>) =>
//       data && <AssessmentActionMenu {...data} />,
//   },
// ];

export default function AssessmentsPage() {
  const { t } = useTranslation(['assessments', 'common']);

  // const { activeAcademicNamespace } = useAcademicNamespace();
  // const { displayName } = usePreferredNameLayout();

  // const [academicNameSpaceId, setAcademicNameSpaceId] = useState<number | null>(
  //   activeAcademicNamespace?.academicNamespaceId ?? null
  // );

  // const { data: assessmentsData = [] } = useAssessments({
  //   academicNameSpaceId: academicNameSpaceId ?? 0,
  // });

  // const columnDefs = useMemo(
  //   () => getColumnDefs(t, displayName),
  //   [t, displayName]
  // );

  return (
    <PageContainer title={t('assessments:pageTitle.assessments')}>
      <PageHeading
        title={t('assessments:pageHeading.assessments')}
        titleProps={{ variant: 'h3' }}
      />
      <ProcessingDataPlaceholder />
    </PageContainer>
  );

  // return (
  //   <PageContainer title={t('assessments:pageTitle.assessments')}>
  //     <PageHeading
  //       title={t('assessments:pageHeading.assessments')}
  //       titleProps={{ variant: 'h3' }}
  //       rightAdornment={
  //         <Box display="flex" alignItems="center">
  //           <Button
  //             variant="contained"
  //             component={Link}
  //             to="./term-assessments/create"
  //             startIcon={<AddDocIcon />}
  //           >
  //             {t('assessments:createAssessment')}
  //           </Button>
  //         </Box>
  //       }
  //     />
  //     {academicNameSpaceId && (
  //       <AcademicYearDropdown
  //         academicNamespaceId={academicNameSpaceId}
  //         onChangeAcademicNamespace={setAcademicNameSpaceId}
  //       />
  //     )}
  //     <Table
  //       rowData={assessmentsData || []}
  //       columnDefs={columnDefs}
  //       getRowId={({ data }) => String(data?.id)}
  //     />
  //   </PageContainer>
  // );
}
