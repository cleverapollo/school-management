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
  TableSwitch,
  GenderSelectCellEditor,
  BulkEditedRows,
} from '@tyro/core';
import { useMemo, useState } from 'react';
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
import { FormTypeDropdown } from '../components/dtr-returns/form-type-dropdown';
import {
  ReturnTypeFromUseFormB,
  useFormB,
  useSaveBulkUpdateStaffFormB,
} from '../api/dtr-returns/form-b';
import { StaffPostSelectCellEditor } from '../components/dtr-returns/staff-post-cell-editor';
import { EmploymentCapacitySelectCellEditor } from '../components/dtr-returns/employment-capacity-cell-editor';

dayjs.extend(LocalizedFormat);

const getColumnFormBDefs = (
  translate: TFunction<
    ('settings' | 'people' | 'common')[],
    undefined,
    ('settings' | 'people' | 'common')[]
  >,
  displayName: ReturnTypeDisplayName,
  capacitiesData: EmploymentCapacityOption[],
  postsData: StaffPostsOption[]
): GridOptions<ReturnTypeFromUseFormB>['columnDefs'] => [
  {
    field: 'staffIre.includeDtrReturns',
    headerName: translate('settings:dtrReturns.formB.includeInDTR'),
    valueFormatter: ({ data }) =>
      data?.staffIre?.includeDtrReturns
        ? translate('common:yes')
        : translate('common:no'),
    cellEditor: TableSwitch,
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseFormB, any>) => (
      <TableBooleanValue value={Boolean(data?.staffIre?.includeDtrReturns)} />
    ),
  },
  {
    field: 'person',
    headerName: translate('common:name'),
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
    valueGetter: ({ data }) => data?.staffIre?.teacherReferenceNumber ?? '-',
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
  },
  {
    field: 'personalInformation.gender',
    headerName: translate('settings:dtrReturns.formB.gender'),
    cellEditorSelector: GenderSelectCellEditor(),
    valueGetter: ({ data }) =>
      data?.personalInformation?.gender
        ? translate(`common:gender.${data?.personalInformation?.gender}`)
        : '-',
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'personalInformation.gender', newValue);
      return true;
    },
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
  },
  {
    field: 'personalInformation.ire.ppsNumber',
    headerName: translate('settings:dtrReturns.formB.ppsNumber'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.personalInformation?.ire?.ppsNumber ?? '-',
    valueSetter: ({ data, newValue, oldValue }) => {
      set(
        data ?? {},
        'personalInformation.ire.ppsNumber',
        (newValue as string).length <= 10 ? newValue : oldValue
      );
      return true;
    },
  },
  {
    field: 'payrollNumber',
    headerName: translate('settings:dtrReturns.formB.payrollNumber'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.payrollNumber ?? '-',
  },
  {
    field: 'staffIre.staffPost',
    headerName: translate('settings:dtrReturns.formB.post'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.staffIre?.staffPost,
    valueFormatter: ({ data }) =>
      data?.staffIre?.staffPost ? data?.staffIre?.staffPost?.name : '-',
    cellEditorSelector: StaffPostSelectCellEditor(postsData),
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'staffIre.staffPost', newValue);
      return true;
    },
  },
  {
    field: 'employmentCapacity',
    headerName: translate('settings:capacity'),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.employmentCapacity,
    valueFormatter: ({ data }) =>
      data?.employmentCapacity ? data?.employmentCapacity?.name : '-',
    cellEditorSelector: EmploymentCapacitySelectCellEditor(capacitiesData),
    valueSetter: ({ data, newValue }) => {
      set(data ?? {}, 'employmentCapacity', newValue);
      return true;
    },
  },
  {
    field: 'jobSharing',
    headerName: translate('settings:dtrReturns.formB.jobSharer'),
    valueGetter: ({ data }) => Boolean(data?.jobSharing),
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
    headerName: translate('settings:dtrReturns.formB.qualificationX', { X: 1 }),
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
  },
  {
    field: 'staffIre.qualifications2',
    headerName: translate('settings:dtrReturns.formB.qualificationX', { X: 2 }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.staffIre?.qualifications2 ?? '-',
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
    headerName: translate('settings:dtrReturns.formB.qualificationX', { X: 3 }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.staffIre?.qualifications3 ?? '-',
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
    headerName: translate('settings:dtrReturns.formB.qualificationX', { X: 4 }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.staffIre?.qualifications4 ?? '-',
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
      X: 1,
    }),
    editable: ({ data }) => Boolean(data?.staffIre?.includeDtrReturns),
    valueGetter: ({ data }) => data?.staffIre?.otherSchool1 ?? '-',
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
    valueGetter: ({ data }) => data?.staffIre?.otherSchool2 ?? '-',
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
    valueGetter: ({ data }) => data?.staffIre?.previousSchool1 ?? '-',
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
    valueGetter: ({ data }) => data?.staffIre?.previousSchool2 ?? '-',
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

export default function DTRReturnsPage() {
  const { t } = useTranslation(['navigation', 'settings', 'people', 'common']);

  const { displayName } = usePreferredNameLayout();
  const { mutateAsync: updateStaffFormB } = useSaveBulkUpdateStaffFormB();
  const { data: capacitiesData = [] } = useEmploymentCapacities();
  const { data: postsData = [] } = useStaffPosts();

  const [formTypeId, setFormTypeId] = useState<number>(1);

  const { data: staffFormB = [] } = useFormB({});

  const columnDefs = useMemo(() => {
    switch (formTypeId) {
      case 1:
        break;
      case 2:
        return getColumnFormBDefs(t, displayName, capacitiesData, postsData);
      default:
        return [];
    }
  }, [t, displayName, formTypeId, capacitiesData, postsData]);

  const dataForTable = useMemo(() => {
    switch (formTypeId) {
      case 1:
        break;
      case 2:
        return staffFormB;
      default:
        return [];
    }
  }, [formTypeId, staffFormB]);

  const saveBulkResult = (
    data: BulkEditedRows<
      ReturnTypeFromUseFormB,
      | 'staffIre.includeDtrReturns'
      | 'person'
      | 'staffIre.teacherReferenceNumber'
      | 'personalInformation.gender'
      | 'personalInformation.ire.ppsNumber'
      | 'payrollNumber'
      | 'staffIre.staffPost'
      | 'employmentCapacity'
      | 'jobSharing'
      | 'qualifications'
      | 'staffIre.qualifications2'
      | 'staffIre.qualifications3'
      | 'staffIre.qualifications4'
      | 'staffIre.otherSchool1'
      | 'staffIre.otherSchool2'
      | 'staffIre.previousSchool1'
      | 'staffIre.previousSchool2'
    >
  ) => {
    console.log('data', data);
    const updates = Object.entries(data).reduce<UpdateStaffInput[]>(
      (acc, [partyId, changes]) => {
        const changeKeys = Object.keys(changes) as Array<keyof typeof changes>;
        const changesByKey = changeKeys.reduce<UpdateStaffInput>(
          (changeAcc, key) => {
            if (key === 'staffIre.includeDtrReturns') {
              changeAcc.includeDtrReturns =
                changes['staffIre.includeDtrReturns']?.newValue;
            }
            if (key === 'staffIre.teacherReferenceNumber') {
              changeAcc.teacherReferenceNumber =
                changes['staffIre.teacherReferenceNumber']?.newValue;
            }
            // missing gender/ppsNumber/payrollNumber
            if (key === 'staffIre.staffPost') {
              changeAcc.staffPost = changes['staffIre.staffPost']?.newValue?.id;
            }
            if (key === 'employmentCapacity') {
              changeAcc.employmentCapacity =
                changes.employmentCapacity?.newValue?.name;
            }
            if (key === 'jobSharing') {
              changeAcc.jobSharing = changes.jobSharing?.newValue;
            }
            if (key === 'qualifications') {
              changeAcc.qualifications = changes.qualifications?.newValue;
            }
            if (key === 'staffIre.qualifications2') {
              changeAcc.qualifications2 =
                changes['staffIre.qualifications2']?.newValue;
            }
            if (key === 'staffIre.qualifications3') {
              changeAcc.qualifications3 =
                changes['staffIre.qualifications3']?.newValue;
            }
            if (key === 'staffIre.qualifications4') {
              changeAcc.qualifications4 =
                changes['staffIre.qualifications4']?.newValue;
            }
            if (key === 'staffIre.otherSchool1') {
              changeAcc.otherSchool1 =
                changes['staffIre.otherSchool1']?.newValue;
            }
            if (key === 'staffIre.otherSchool2') {
              changeAcc.otherSchool2 =
                changes['staffIre.otherSchool2']?.newValue;
            }
            if (key === 'staffIre.previousSchool1') {
              changeAcc.previousSchool1 =
                changes['staffIre.previousSchool1']?.newValue;
            }
            if (key === 'staffIre.previousSchool2') {
              changeAcc.previousSchool2 =
                changes['staffIre.previousSchool2']?.newValue;
            }

            return changeAcc;
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

  return (
    <PageContainer title={t('navigation:management.settings.dtrReturns')}>
      <PageHeading
        title={t('navigation:management.settings.dtrReturns')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={() => {}}
              startIcon={<DownloadArrowCircleIcon />}
            >
              {t('settings:dtrReturns.downloadFile')}
            </Button>
          </Box>
        }
      />
      <FormTypeDropdown
        formTypeId={formTypeId}
        onChangeFormType={setFormTypeId}
      />
      <Table
        rowData={dataForTable || []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data?.partyId)}
        onBulkSave={saveBulkResult}
      />
    </PageContainer>
  );
}
