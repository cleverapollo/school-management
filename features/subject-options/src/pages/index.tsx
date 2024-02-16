import { useMemo } from 'react';
import { Box, Button } from '@mui/material';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  ICellRendererParams,
  PageHeading,
  RouterLink,
  Table,
  TableBooleanValue,
  PageContainer,
  commonActionMenuProps,
  ActionMenu,
  useDebouncedValue,
  TableLinearProgress,
} from '@tyro/core';
import { Link } from 'react-router-dom';
import {
  AddDocIcon,
  CheckmarkCircleIcon,
  CopyIcon,
  EditCalendarIcon,
  EditIcon,
  StopIcon,
  TrashIcon,
  VerticalDotsIcon,
} from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { usePermissions, UsePermissionsReturn } from '@tyro/api';
import {
  ReturnTypeFromUseOptionsSetupList,
  useOptionsSetupList,
} from '../api/options';
import { PublishOptionsModal } from '../components/list/publish-modal';
import { ConfirmUnpublishModal } from '../components/list/confirm-unpublish-modal';
import { CloneOptionsModal } from '../components/list/clone-modal';
import { ConfirmDeleteModal } from '../components/list/confirm-delete-modal';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<
    ('subjectOptions' | 'common')[],
    undefined,
    ('subjectOptions' | 'common')[]
  >,
  openPublish: (id: ReturnTypeFromUseOptionsSetupList) => void,
  openUnpublish: (id: ReturnTypeFromUseOptionsSetupList) => void,
  cloneOptions: (id: ReturnTypeFromUseOptionsSetupList) => void,
  deleteOption: (id: ReturnTypeFromUseOptionsSetupList) => void,
  isStaffUserWithPermission: UsePermissionsReturn['isStaffUserWithPermission']
): GridOptions<ReturnTypeFromUseOptionsSetupList>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseOptionsSetupList>) =>
      data && <RouterLink to={`./${data.id}`}>{data.name}</RouterLink>,
  },
  {
    field: 'yearGroup.name',
    headerName: t('subjectOptions:yearGroupFor'),
  },
  {
    field: 'parentsDueByDate',
    headerName: t('common:dueDate'),
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
    valueGetter: ({ data }) => dayjs(data?.parentsDueByDate).format('ll'),
  },
  {
    field: 'studentPreferencesCompleteCount',
    headerName: t('common:responses'),
    suppressSizeToFit: true,
    valueGetter: ({ data }) =>
      data &&
      `${data?.studentPreferencesCompleteCount ?? '-'}/${
        data?.studentCount ?? '-'
      }`,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseOptionsSetupList>) =>
      data && (
        <TableLinearProgress
          value={data?.studentPreferencesCompleteCount}
          total={data?.studentCount}
        />
      ),
  },
  {
    field: 'publishedToParents',
    headerName: t('subjectOptions:publishedToParents'),
    valueGetter: ({ data }) => {
      if (!data) return null;

      return data.publishedToParents ? t('common:yes') : t('common:no');
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseOptionsSetupList>) => {
      if (!data) return null;

      return <TableBooleanValue value={data.publishedToParents} />;
    },
  },
  {
    ...commonActionMenuProps,
    hide: !isStaffUserWithPermission('ps:1:options:write_options'),
    suppressColumnsToolPanel: !isStaffUserWithPermission(
      'ps:1:options:write_options'
    ),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseOptionsSetupList>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            ...(data.publishedToParents
              ? [
                  {
                    label: t('subjectOptions:editPublishDetails'),
                    icon: <EditCalendarIcon />,
                    onClick: () => openPublish(data),
                  },
                  {
                    label: t('common:actions.unpublish'),
                    icon: <StopIcon />,
                    onClick: () => openUnpublish(data),
                  },
                ]
              : [
                  {
                    label: t('common:actions.publish'),
                    icon: <CheckmarkCircleIcon />,
                    onClick: () => openPublish(data),
                  },
                ]),
            {
              label: t('common:actions.edit'),
              icon: <EditIcon />,
              navigateTo: `edit/${data.id}`,
            },
            {
              label: t('common:actions.clone'),
              icon: <CopyIcon />,
              onClick: () => cloneOptions(data),
            },
            {
              label: t('common:actions.delete'),
              icon: <TrashIcon />,
              isDelete: true,
              onClick: () => deleteOption(data),
            },
          ]}
        />
      ),
  },
];

export default function SubjectOptionsPage() {
  const { t } = useTranslation(['navigation', 'common', 'subjectOptions']);

  const { data: optionsSetupList = [] } = useOptionsSetupList({});
  const { isStaffUserWithPermission } = usePermissions();
  const {
    value: optionsToPublish,
    debouncedValue: debouncedOptionsToPublish,
    setValue: setOptionsToPublish,
  } = useDebouncedValue<ReturnTypeFromUseOptionsSetupList | null>({
    defaultValue: null,
  });
  const {
    value: optionsToUnpublish,
    debouncedValue: debouncedOptionsToUnpublish,
    setValue: setOptionsToUnpublish,
  } = useDebouncedValue<ReturnTypeFromUseOptionsSetupList | null>({
    defaultValue: null,
  });
  const {
    value: optionsToClone,
    debouncedValue: debouncedOptionsToClone,
    setValue: setOptionsToClone,
  } = useDebouncedValue<ReturnTypeFromUseOptionsSetupList | null>({
    defaultValue: null,
  });
  const {
    value: optionsToDelete,
    debouncedValue: debouncedOptionsToDelete,
    setValue: setOptionsToDelete,
  } = useDebouncedValue<ReturnTypeFromUseOptionsSetupList | null>({
    defaultValue: null,
  });

  const columnDefs = useMemo(
    () =>
      getColumnDefs(
        t,
        setOptionsToPublish,
        setOptionsToUnpublish,
        setOptionsToClone,
        setOptionsToDelete,
        isStaffUserWithPermission
      ),
    [
      t,
      setOptionsToPublish,
      setOptionsToUnpublish,
      setOptionsToClone,
      setOptionsToDelete,
      isStaffUserWithPermission,
    ]
  );

  return (
    <>
      <PageContainer title={t('navigation:management.subjectOptions')}>
        <PageHeading
          title={t('navigation:management.subjectOptions')}
          titleProps={{ variant: 'h3' }}
          rightAdornment={
            isStaffUserWithPermission('ps:1:options:write_options') ? (
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
            ) : undefined
          }
        />
        <Table
          rowData={optionsSetupList}
          columnDefs={columnDefs}
          getRowId={({ data }) => String(data?.id)}
        />
      </PageContainer>
      <PublishOptionsModal
        optionsToPublish={optionsToPublish ?? debouncedOptionsToPublish}
        open={Boolean(optionsToPublish)}
        onClose={() => setOptionsToPublish(null)}
      />
      <ConfirmUnpublishModal
        optionsToUnpublish={optionsToUnpublish ?? debouncedOptionsToUnpublish}
        open={Boolean(optionsToUnpublish)}
        onClose={() => setOptionsToUnpublish(null)}
      />
      <CloneOptionsModal
        currentOptionsList={optionsSetupList}
        optionsToClone={optionsToClone ?? debouncedOptionsToClone}
        open={Boolean(optionsToClone)}
        onClose={() => setOptionsToClone(null)}
      />
      <ConfirmDeleteModal
        optionsToDelete={optionsToDelete ?? debouncedOptionsToDelete}
        open={Boolean(optionsToDelete)}
        onClose={() => setOptionsToDelete(null)}
      />
    </>
  );
}
