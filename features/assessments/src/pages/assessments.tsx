import { Box, Chip } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageHeading,
  ReturnTypeDisplayName,
  RouterLink,
  Table,
  TableBooleanValue,
  usePreferredNameLayout,
  PageContainer,
  commonActionMenuProps,
} from '@tyro/core';
import { useMemo, useState } from 'react';
import {
  useAcademicNamespace,
  usePermissions,
  AssessmentType,
  StateCbaType,
} from '@tyro/api';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  ReturnTypeFromUseAssessments,
  useAssessments,
} from '../api/assessments';
import { AcademicYearDropdown } from '../components/common/academic-year-dropdown';
import { getAssessmentSubjectGroupsLink } from '../utils/get-assessment-subject-groups-link';
import { AssessmentActionMenu } from '../components/list-assessments/assessment-action-menu';

dayjs.extend(LocalizedFormat);

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
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessments>) =>
      data && (
        <RouterLink
          to={getAssessmentSubjectGroupsLink(
            data.id,
            data.assessmentType,
            data.academicNamespaceId
          )}
        >
          {data.name}
        </RouterLink>
      ),
  },
  {
    colId: 'assessmentType',
    headerName: translate('common:type'),
    enableRowGroup: true,
    valueGetter: ({ data }) => {
      if (
        data?.assessmentType &&
        data?.assessmentType === AssessmentType.Term
      ) {
        return data?.assessmentType
          ? translate(`assessments:assessmentTypes.${data.assessmentType}`)
          : null;
      }

      if (
        data?.stateCbaType &&
        data?.stateCbaType.includes(StateCbaType.Cba_1)
      ) {
        return translate(`assessments:CBA_1`);
      }
      return translate(`assessments:CBA_2`);
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessments>) => {
      const isStateCba1 =
        data?.stateCbaType && data?.stateCbaType.includes(StateCbaType.Cba_1);

      return data?.assessmentType === AssessmentType.Term &&
        data?.assessmentType ? (
        <Chip
          size="small"
          variant="soft"
          color="emerald"
          sx={{ color: 'emerald.500', bgcolor: 'emerald.100' }}
          label={translate(
            `assessments:assessmentTypes.${data?.assessmentType}`
          )}
        />
      ) : (
        <Chip
          size="small"
          variant="soft"
          color={isStateCba1 ? 'sky' : 'violet'}
          sx={{
            color: isStateCba1 ? 'sky.500' : 'violet.500',
            bgcolor: isStateCba1 ? 'sky.100' : 'violet.100',
          }}
          label={
            isStateCba1
              ? translate(`assessments:CBA_1`)
              : translate(`assessments:CBA_2`)
          }
        />
      );
    },
  },
  {
    field: 'years',
    headerName: translate('common:year'),
    valueGetter: ({ data }) =>
      data?.years?.map((year) => year?.name).join(', '),
  },
  {
    field: 'startDate',
    headerName: translate('common:startDate'),
    valueGetter: ({ data }) =>
      data ? dayjs(data.startDate).format('LL') : null,
    sort: 'desc',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'endDate',
    headerName: translate('common:endDate'),
    valueGetter: ({ data }) => (data ? dayjs(data.endDate).format('LL') : null),
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'createdBy',
    headerName: translate('common:createdBy'),
    valueGetter: ({ data }) => (data ? displayName(data.createdBy) : null),
  },
  {
    colId: 'publishedFrom',
    headerName: translate('assessments:publishedOnline'),
    valueGetter: ({ data }) => {
      if (!data) return null;

      if (
        data.publishedFrom &&
        dayjs(data.publishedFrom).isAfter(dayjs(), 'day')
      ) {
        return translate('common:fromDate', {
          date: dayjs(data.publishedFrom).format('LL'),
        });
      }

      return data.publishedFrom
        ? translate('common:yes')
        : translate('common:no');
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessments>) => {
      if (!data) return null;

      if (
        data.publishedFrom &&
        dayjs(data.publishedFrom).isAfter(dayjs(), 'day')
      ) {
        return translate('common:fromDate', {
          date: dayjs(data.publishedFrom).format('LL'),
        });
      }

      return <TableBooleanValue value={!!data.publishedFrom} />;
    },
  },
  {
    ...commonActionMenuProps,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessments>) =>
      data && <AssessmentActionMenu {...data} />,
  },
];

export default function AssessmentsPage() {
  const { t } = useTranslation(['assessments', 'common']);

  const { hasPermission, isTyroUser } = usePermissions();
  const { activeAcademicNamespace } = useAcademicNamespace();
  const { displayName } = usePreferredNameLayout();

  const [academicNameSpaceId, setAcademicNameSpaceId] = useState<number | null>(
    activeAcademicNamespace?.academicNamespaceId ?? null
  );

  const { data: assessmentsData = [] } = useAssessments({
    academicNameSpaceId: academicNameSpaceId ?? 0,
  });

  const canCreateAssessment = hasPermission(
    'ps:1:assessment:write_assessments'
  );
  const columnDefs = useMemo(
    () => getColumnDefs(t, displayName),
    [t, displayName]
  );

  return (
    <PageContainer title={t('assessments:pageTitle.assessments')}>
      <PageHeading
        title={t('assessments:pageHeading.assessments')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          canCreateAssessment && (
            <Box display="flex" alignItems="center">
              <Box>
                <ActionMenu
                  buttonLabel={t('assessments:createAssessment')}
                  menuItems={[
                    {
                      label: t('assessments:termAssessment'),
                      navigateTo: './term-assessments/create',
                    },
                    {
                      label: t('assessments:assessmentTypes.STATE_CBA'),
                      navigateTo: './state-cba/create',
                    },
                  ]}
                />
              </Box>
            </Box>
          )
        }
      />
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
      />
    </PageContainer>
  );
}
