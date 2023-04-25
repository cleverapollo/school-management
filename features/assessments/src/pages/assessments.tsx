import { Box, Button, Collapse, Fade, Stack, Typography } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  RouterLink,
  Table,
  TableBooleanValue,
  usePreferredNameLayout,
} from '@tyro/core';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { AddIcon } from '@tyro/icons';
import { useAcademicNamespace, UseQueryReturnType } from '@tyro/api';
import dayjs from 'dayjs';
import { PageContainer } from '../components/page-container';
import { useAssessments } from '../api/assessments';
import { AssessmentActionMenu } from '../components/list-assessments/assessment-action-menu';
import { AcademicYearDropdown } from '../components/list-assessments/academic-year-dropdown';
import { getAssessmentSubjectGroupsLink } from '../utils/get-assessment-subject-groups-link';

type ReturnTypeFromUseAssessments = UseQueryReturnType<
  typeof useAssessments
>[number];

const getColumnDefs = (
  translate: TFunction<
    ('assessments' | 'common')[],
    undefined,
    ('assessments' | 'common')[]
  >,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseAssessments>['columnDefs'] => [
  {
    field: 'name',
    headerName: translate('common:name'),
    checkboxSelection: ({ data }) => Boolean(data),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessments>) =>
      data && (
        <RouterLink
          to={getAssessmentSubjectGroupsLink(data.id, data.assessmentType)}
        >
          {data.name}
        </RouterLink>
      ),
  },
  {
    field: 'assessmentType',
    headerName: translate('common:type'),
    enableRowGroup: true,
    valueGetter: ({ data }) =>
      data?.assessmentType
        ? translate(`assessments:assessmentTypes.${data.assessmentType}`)
        : '',
  },
  {
    field: 'createdBy',
    headerName: translate('common:createdBy'),
    valueGetter: ({ data }) => (data ? displayName(data.createdBy) : '-'),
  },
  {
    field: 'dateOfCreation',
    headerName: translate('common:dateOfCreation'),
    valueGetter: ({ data }) =>
      data ? dayjs(data.createdOn).format('LL') : '-',
  },
  {
    field: 'publish',
    headerName: translate('assessments:publishedOnline'),
    valueGetter: ({ data }) =>
      data?.publish ? translate('common:yes') : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessments>) => (
      <TableBooleanValue value={!!data?.publish} />
    ),
  },
];

export default function AssessmentsPage() {
  const { t } = useTranslation(['assessments', 'common']);

  const { activeAcademicNamespace } = useAcademicNamespace();
  const { displayName } = usePreferredNameLayout();

  const [academicNameSpaceId, setAcademicNameSpaceId] = useState<number | null>(
    activeAcademicNamespace?.academicNamespaceId ?? null
  );

  const { data: assessmentsData = [] } = useAssessments({
    academicNameSpaceId,
  });

  const [selectedAssessment, setSelectedAssessment] =
    useState<ReturnTypeFromUseAssessments | null>(null);

  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName),
    [t, displayName]
  );

  return (
    <PageContainer title={t('assessments:pageTitle.assessments')}>
      <Typography variant="h3" component="h1">
        {t('assessments:pageHeading.assessments')}
      </Typography>
      {academicNameSpaceId && (
        <AcademicYearDropdown
          academicNamespaceId={academicNameSpaceId}
          onChangeAcademicNamespace={setAcademicNameSpaceId}
        />
      )}
      <Table
        rowData={assessmentsData || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.id)}
        rowSelection="single"
        onRowSelection={([newValue]) => setSelectedAssessment(newValue)}
        rightAdornment={
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              // TODO: add way to create any kind of assessments
              variant="text"
              component={Link}
              to="./term-assessments/create"
              startIcon={<AddIcon />}
            >
              {t('assessments:createAssessment')}
            </Button>
            <Collapse
              in={!!selectedAssessment}
              orientation="horizontal"
              unmountOnExit
            >
              <Fade in={!!selectedAssessment}>
                <Box>
                  <AssessmentActionMenu {...selectedAssessment} />
                </Box>
              </Fade>
            </Collapse>
          </Stack>
        }
      />
    </PageContainer>
  );
}
