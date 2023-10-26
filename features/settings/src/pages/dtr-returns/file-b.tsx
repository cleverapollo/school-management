import { useMemo } from 'react';
import { Box, Tooltip } from '@mui/material';
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
  TableSwitch,
  GenderSelectCellEditor,
  BulkEditedRows,
  ValueSetterParams,
} from '@tyro/core';
import { DownloadArrowCircleIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import set from 'lodash/set';
import { UpdateStaffInput } from '@tyro/api';
import {
  EmploymentCapacityOption,
  useEmploymentCapacities,
} from '@tyro/people/src/api/staff/employment-capacities';
import {
  StaffPostsOption,
  useStaffPosts,
} from '@tyro/people/src/api/staff/staff-posts';
import { LoadingButton } from '@mui/lab';
import {
  ReturnTypeFromUseFormB,
  useFormB,
  useSaveBulkUpdateStaffFormB,
} from '../../api/dtr-returns/form-b';
import { StaffPostSelectCellEditor } from '../../components/dtr-returns/staff-post-cell-editor';
import { EmploymentCapacitySelectCellEditor } from '../../components/dtr-returns/employment-capacity-cell-editor';
import { useDownloadFile } from '../../api/dtr-returns/download-file';

dayjs.extend(LocalizedFormat);

const UpdateStaffKeys = {
  'staffIre.staffPost': 'staffPost',
  'personalInformation.gender': 'gender',
  'staffIre.includeDtrReturns': 'includeDtrReturns',
  'staffIre.teacherReferenceNumber': 'teacherReferenceNumber',
  'personalInformation.ire.ppsNumber': 'ppsNumber',
  payrollNumber: 'payrollNumber',
  employmentCapacity: 'employmentCapacity',
  jobSharing: 'jobSharing',
  qualifications: 'qualifications',
  'staffIre.qualifications2': 'qualifications2',
  'staffIre.qualifications3': 'qualifications3',
  'staffIre.qualifications4': 'qualifications4',
  'staffIre.otherSchool1': 'otherSchool1',
  'staffIre.otherSchool2': 'otherSchool2',
  'staffIre.previousSchool1': 'previousSchool1',
  'staffIre.previousSchool2': 'previousSchool2',
};

const getColumnFormBDefs = (
  translate: TFunction<
    ('settings' | 'common' | 'people')[],
    undefined,
    ('settings' | 'common' | 'people')[]
  >,
  postsData: StaffPostsOption[],
  capacitiesData: EmploymentCapacityOption[],
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseFormB>['columnDefs'] => [
  {
    field: 'staffIre.includeDtrReturns',
    headerName: translate('settings:dtrReturns.formB.includeInDTR'),
    cellEditor: TableSwitch,
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    filter: true,
    valueFormatter: ({ data }) =>
      data?.staffIre?.includeDtrReturns
        ? translate('common:yes')
        : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFormB, any>) => (
      <TableBooleanValue value={Boolean(data?.staffIre?.includeDtrReturns)} />
    ),
  },
  {
    field: 'person',
    headerName: translate('common:name'),
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseFormB>) =>
      data && (
        <RouterLink to={`/people/staff/${data.partyId}`}>
          {displayName(data.person)}
        </RouterLink>
      ),
  },
  {
    field: 'staffIre.teacherReferenceNumber',
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    headerName: translate('settings:dtrReturns.formB.dtrReference'),
    valueSetter: ({ data, newValue }) => {
      const value = !newValue ? undefined : Number(newValue);
      set(
        data ?? {},
        'staffIre.teacherReferenceNumber',
        Number.isNaN(value) || value === undefined
          ? undefined
          : Math.max(1, Math.min(999, value))
      );
      return true;
    },
    cellClassRules: {
      'failed-cell': ({ data }) =>
        Boolean(
          data?.staffIre?.includeDtrReturns &&
            !data?.staffIre?.teacherReferenceNumber
        ),
    },
  },
  {
    field: 'personalInformation.gender',
    headerName: translate('settings:dtrReturns.formB.gender'),
    cellEditorSelector: GenderSelectCellEditor(translate),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueFormatter: ({ data }) =>
      data?.personalInformation?.gender
        ? translate(`people:gender.${data?.personalInformation?.gender}`)
        : '-',
    cellClassRules: {
      'failed-cell': ({ data }) =>
        Boolean(
          data?.staffIre?.includeDtrReturns &&
            !data?.personalInformation?.gender
        ),
    },
  },
  {
    field: 'personalInformation.ire.ppsNumber',
    headerName: translate('settings:dtrReturns.formB.ppsNumber'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    cellEditorParams: { maxLength: 10 },
    valueSetter: ({
      data,
      newValue,
      oldValue,
    }: ValueSetterParams<ReturnTypeFromUseFormB, string | null>) => {
      let replacedValue = newValue?.trim() ?? null;

      if (typeof replacedValue === 'string' && replacedValue.length > 10) {
        replacedValue = oldValue;
      }

      set(data ?? {}, 'personalInformation.ire.ppsNumber', replacedValue);
      return true;
    },
    cellClassRules: {
      'failed-cell': ({ data }) =>
        Boolean(
          data?.staffIre?.includeDtrReturns &&
            !data?.personalInformation?.ire?.ppsNumber
        ),
    },
  },
  {
    field: 'payrollNumber',
    headerName: translate('settings:dtrReturns.formB.payrollNumber'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.payrollNumber,
  },
  {
    field: 'staffIre.staffPost',
    headerName: translate('settings:dtrReturns.formB.post'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueFormatter: ({ data }) =>
      data?.staffIre?.staffPost ? data?.staffIre?.staffPost?.name : '-',
    cellEditorSelector: StaffPostSelectCellEditor(postsData),
  },
  {
    field: 'employmentCapacity',
    headerName: translate('settings:capacity'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueFormatter: ({ data }) =>
      data?.employmentCapacity ? data?.employmentCapacity?.name : '-',
    cellEditorSelector: EmploymentCapacitySelectCellEditor(capacitiesData),
    cellClassRules: {
      'failed-cell': ({ data }) =>
        Boolean(
          data?.staffIre?.includeDtrReturns && !data?.employmentCapacity?.name
        ),
    },
  },
  {
    field: 'jobSharing',
    headerName: translate('settings:dtrReturns.formB.jobSharer'),
    cellEditor: TableSwitch,
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueFormatter: ({ data }) =>
      data?.staffIre?.includeDtrReturns
        ? translate('common:yes')
        : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFormB, any>) => (
      <TableBooleanValue value={Boolean(data?.jobSharing)} />
    ),
  },
  {
    field: 'qualifications',
    headerName: translate('settings:dtrReturns.formB.qualificationX', {
      number: 1,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.qualifications ?? '-',
    valueSetter: ({ data, newValue, oldValue }) => {
      set(
        data ?? {},
        'qualifications',
        (newValue as string).length <= 20 ? newValue : oldValue
      );
      return true;
    },
    cellClassRules: {
      'failed-cell': ({ data }) =>
        Boolean(data?.staffIre?.includeDtrReturns && !data?.qualifications),
    },
  },
  {
    field: 'staffIre.qualifications2',
    headerName: translate('settings:dtrReturns.formB.qualificationX', {
      number: 2,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueSetter: ({ data, newValue, oldValue }) => {
      set(
        data ?? {},
        'staffIre.qualifications2',
        (newValue as string).length <= 20 ? newValue : oldValue
      );
      return true;
    },
  },
  {
    field: 'staffIre.qualifications3',
    headerName: translate('settings:dtrReturns.formB.qualificationX', {
      number: 3,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueSetter: ({ data, newValue, oldValue }) => {
      set(
        data ?? {},
        'staffIre.qualifications3',
        (newValue as string).length <= 20 ? newValue : oldValue
      );
      return true;
    },
  },
  {
    field: 'staffIre.qualifications4',
    headerName: translate('settings:dtrReturns.formB.qualificationX', {
      number: 4,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueSetter: ({ data, newValue, oldValue }) => {
      set(
        data ?? {},
        'staffIre.qualifications4',
        (newValue as string).length <= 20 ? newValue : oldValue
      );
      return true;
    },
  },
  {
    field: 'staffIre.otherSchool1',
    headerName: translate('settings:dtrReturns.formB.currentTeachingSchoolX', {
      number: 1,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueSetter: ({ data, newValue, oldValue }) => {
      set(
        data ?? {},
        'staffIre.otherSchool1',
        (newValue as string).length <= 20 ? newValue : oldValue
      );
      return true;
    },
  },
  {
    field: 'staffIre.otherSchool2',
    headerName: translate('settings:dtrReturns.formB.currentTeachingSchoolX', {
      X: 2,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueSetter: ({ data, newValue, oldValue }) => {
      set(
        data ?? {},
        'staffIre.otherSchool2',
        (newValue as string).length <= 20 ? newValue : oldValue
      );
      return true;
    },
  },
  {
    field: 'staffIre.previousSchool1',
    headerName: translate('settings:dtrReturns.formB.previousTeachingSchoolX', {
      X: 1,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueSetter: ({ data, newValue, oldValue }) => {
      set(
        data ?? {},
        'staffIre.previousSchool1',
        (newValue as string).length <= 20 ? newValue : oldValue
      );
      return true;
    },
  },
  {
    field: 'staffIre.previousSchool2',
    headerName: translate('settings:dtrReturns.formB.previousTeachingSchoolX', {
      X: 2,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueSetter: ({ data, newValue, oldValue }) => {
      set(
        data ?? {},
        'staffIre.previousSchool2',
        (newValue as string).length <= 20 ? newValue : oldValue
      );
      return true;
    },
  },
];

export default function DTRReturnsFileB() {
  const { t } = useTranslation(['navigation', 'settings', 'common', 'people']);

  const { displayName } = usePreferredNameLayout();
  const { mutateAsync: updateStaffFormB } = useSaveBulkUpdateStaffFormB();
  const { data: capacitiesData = [] } = useEmploymentCapacities();
  const { data: postsData = [] } = useStaffPosts();

  const { data: staffFormB } = useFormB({});

  const { mutateAsync: downloadFile, isLoading: isDownloadLoading } =
    useDownloadFile();

  const columnDefs = useMemo(
    () => getColumnFormBDefs(t, postsData, capacitiesData, displayName),
    [t, displayName, capacitiesData, postsData]
  );

  const getIsDownloadDisabled = () => {
    if (!staffFormB) return true;

    return !!staffFormB
      .filter((staff) => staff?.staffIre?.includeDtrReturns)
      .some(
        (staff) =>
          !displayName(staff?.person) ||
          !staff?.staffIre?.teacherReferenceNumber ||
          !staff?.personalInformation?.gender ||
          !staff?.personalInformation?.ire?.ppsNumber ||
          !staff?.employmentCapacity ||
          !staff?.qualifications ||
          !staff?.staffIre?.includeDtrReturns
      );
  };

  const saveBulkResult = (
    data: BulkEditedRows<ReturnTypeFromUseFormB, keyof typeof UpdateStaffKeys>
  ) => {
    const updates = Object.entries(data).reduce<UpdateStaffInput[]>(
      (acc, [partyId, changes]) => {
        const changeKeys = Object.keys(changes) as Array<keyof typeof changes>;
        const changesByKey = changeKeys.reduce<UpdateStaffInput>(
          (changeAcc, key) => {
            const keyToUpdate = UpdateStaffKeys[key];
            let newData = { ...changeAcc };

            if (key === 'staffIre.staffPost') {
              newData.staffPost = changes?.[key]?.newValue?.id;
            } else if (key === 'personalInformation.gender') {
              const newGender = changes?.[key]?.newValue;
              newData.gender = newGender;
            } else if (key === 'employmentCapacity') {
              newData.employmentCapacity = changes?.[key]?.newValue?.id;
            } else {
              newData = {
                ...newData,
                [keyToUpdate]: changes?.[key]?.newValue,
              };
            }

            return newData;
          },
          {
            staffPartyId: Number(partyId),
          }
        );

        acc.push(changesByKey);

        return acc;
      },
      []
    );
    return updateStaffFormB(updates);
  };

  const isDownloadDisabled = getIsDownloadDisabled();

  return (
    <PageContainer title={t('navigation:management.settings.dtrReturns')}>
      <PageHeading
        title={t('navigation:management.settings.dtrReturns')}
        titleProps={{ variant: 'h3' }}
        breadcrumbs={{
          links: [
            {
              name: t('navigation:management.settings.dtrReturns'),
              href: '/settings/dtr-returns',
            },
            {
              name: t('settings:dtrReturns.fileB'),
            },
          ],
        }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Tooltip
              describeChild
              title={
                isDownloadDisabled
                  ? t('settings:youMustCompleteAllHighlightedFields')
                  : ''
              }
            >
              <span>
                <LoadingButton
                  disabled={isDownloadDisabled}
                  variant="contained"
                  loading={isDownloadLoading}
                  onClick={() => downloadFile('FILE_B')}
                  startIcon={<DownloadArrowCircleIcon />}
                >
                  {t('settings:dtrReturns.downloadFile')}
                </LoadingButton>
              </span>
            </Tooltip>
          </Box>
        }
      />
      <Table
        rowData={staffFormB || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.partyId)}
        onBulkSave={saveBulkResult}
        tableContainerSx={{
          '& .failed-cell': {
            backgroundColor: 'red.100',
          },
        }}
      />
    </PageContainer>
  );
}
