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
} from '@tyro/core';
import { Link } from 'react-router-dom';
import {
  AddDocIcon,
  CheckmarkCircleIcon,
  EditCalendarIcon,
  StopIcon,
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

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<
    ('subjectOptions' | 'common')[],
    undefined,
    ('subjectOptions' | 'common')[]
  >,
  openPublish: (id: ReturnTypeFromUseOptionsSetupList) => void,
  openUnpublish: (id: ReturnTypeFromUseOptionsSetupList) => void,
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
    field: 'yearGroupEnrolmentParty.name',
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
          menuItems={
            data.publishedToParents
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
                ]
          }
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

  const columnDefs = useMemo(
    () =>
      getColumnDefs(
        t,
        setOptionsToPublish,
        setOptionsToUnpublish,
        isStaffUserWithPermission
      ),
    [t, setOptionsToPublish, setOptionsToUnpublish]
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
    </>
  );
}
