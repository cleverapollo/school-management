import { useParams } from 'react-router-dom';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ActionMenu,
  commonActionMenuProps,
  getNumber,
  GridOptions,
  ICellRendererParams,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  useDebouncedValue,
  usePreferredNameLayout,
} from '@tyro/core';

import { TFunction, useTranslation } from '@tyro/i18n';
import { Box, Button } from '@mui/material';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { usePermissions } from '@tyro/api';
import { AddIcon, EditIcon, TrashIcon, VerticalDotsIcon } from '@tyro/icons';
import {
  ReturnTypeFromUseStudentAen,
  useStudentAenData,
} from '../../../api/student/aen/student-aen-data';
import {
  EditAenModalProps,
  EditNoteModal,
} from '../../../components/students/aen/edit-aen-modal';
import {
  DeleteAenConfirmModalProps,
  DeleteAenConfirmModal,
} from '../../../components/students/aen/delete-aen-confirm-modal';

dayjs.extend(LocalizedFormat);

const getStudentNoteColumns = (
  translate: TFunction<('common' | 'people')[]>,
  displayName: ReturnTypeDisplayName,
  onEdit: Dispatch<SetStateAction<EditAenModalProps['initialState']>>,
  onDelete: Dispatch<SetStateAction<DeleteAenConfirmModalProps['aenDetails']>>
): GridOptions<
  ReturnTypeFromUseStudentAen['entries'][number]
>['columnDefs'] => [
  {
    field: 'type',
    headerName: translate('people:aen.type'),
    filter: true,
    sortable: true,
    autoHeight: true,
    wrapText: true,
  },
  {
    field: 'typeNote',
    headerName: translate('people:aen.typeNote'),
    filter: true,
    sortable: true,
    autoHeight: true,
    wrapText: true,
    width: 300,
    cellStyle: {
      lineHeight: 2,
      paddingTop: 12,
      paddingBottom: 12,
      wordBreak: 'break-word',
    },
  },
  {
    field: 'provision',
    headerName: translate('people:aen.provision'),
    filter: true,
    sortable: true,
    autoHeight: true,
    wrapText: true,
    suppressSizeToFit: true,
  },
  {
    field: 'contact',
    headerName: translate('people:aen.contact'),
    filter: true,
    sortable: true,
    autoHeight: true,
    wrapText: true,
    suppressSizeToFit: true,
  },
  {
    field: 'snaSupport',
    headerName: translate('people:aen.anaSupport'),
    filter: true,
    sortable: true,
    autoHeight: true,
    wrapText: true,
    suppressSizeToFit: true,
  },
  {
    field: 'note',
    headerName: translate('people:aen.note'),
    filter: true,
    sortable: true,
    autoHeight: true,
    wrapText: true,
    width: 300,
    cellStyle: {
      lineHeight: 2,
      paddingTop: 12,
      paddingBottom: 12,
      wordBreak: 'break-word',
    },
  },
  {
    ...commonActionMenuProps,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentAen['entries'][number]>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: translate('people:editAen'),
              icon: <EditIcon />,
              onClick: () => onEdit(data),
              hasAccess: ({ isStaffUserWithPermission }) =>
                isStaffUserWithPermission('ps:1:wellbeing:write_student_aen'),
            },
            {
              label: translate('common:actions.delete'),
              icon: <TrashIcon />,
              onClick: () => onDelete(data),
              hasAccess: ({ isStaffUserWithPermission }) =>
                isStaffUserWithPermission('ps:1:wellbeing:write_student_aen'),
            },
          ]}
        />
      ),
  },
];

export default function StudentProfileAenPage() {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'people']);

  const { displayName } = usePreferredNameLayout();
  const { isStaffUserWithPermission } = usePermissions();
  const studentId = getNumber(id);
  const { data: studenAen } = useStudentAenData(studentId ?? 0);
  const [aenDetails, setNoteDetails] =
    useState<EditAenModalProps['initialState']>(null);

  const {
    value: noteToDelete,
    debouncedValue: debouncedNoteToDelete,
    setValue: setNoteToDelete,
  } = useDebouncedValue<DeleteAenConfirmModalProps['aenDetails']>({
    defaultValue: null,
  });

  const studentNoteColumns = useMemo(
    () =>
      getStudentNoteColumns(t, displayName, setNoteDetails, setNoteToDelete),
    [t]
  );

  return (
    <>
      <PageHeading
        title=""
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          isStaffUserWithPermission('ps:1:wellbeing:write_student_aen') && (
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                onClick={() => setNoteDetails({})}
                startIcon={<AddIcon />}
              >
                {t('people:createAen')}
              </Button>
            </Box>
          )
        }
      />
      <Table
        rowData={studenAen?.entries ?? []}
        columnDefs={studentNoteColumns}
        tableContainerSx={{ height: 300 }}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
      />
      {aenDetails && (
        <EditNoteModal
          studentId={studentId!}
          initialState={aenDetails}
          onClose={() => setNoteDetails(null)}
        />
      )}
      <DeleteAenConfirmModal
        open={!!noteToDelete}
        aenDetails={debouncedNoteToDelete}
        onClose={() => setNoteToDelete(null)}
      />
    </>
  );
}
