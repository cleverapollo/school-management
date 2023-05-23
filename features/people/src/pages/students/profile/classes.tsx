import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  TableStudyLevelChip,
  StudyLevelSelectCellEditor,
  TableAvatar,
  getNumber,
  ActionMenu,
  ActionMenuProps,
  useDisclosure,
} from '@tyro/core';

import set from 'lodash/set';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { Box, Fade } from '@mui/material';
import { MobileIcon } from '@tyro/icons';
import { SmsRecipientType } from '@tyro/api';
import { useStudentsSubjectGroups } from '../../../api/student/overview';

type ReturnTypeFromUseStudentsSubjectGroups = NonNullable<
  ReturnType<typeof useStudentsSubjectGroups>['data']
>[number];

const getSubjectGroupsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayNames: ReturnTypeDisplayNames
): GridOptions<ReturnTypeFromUseStudentsSubjectGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentsSubjectGroups>) => {
      if (!data) return null;

      const subject = data?.subjects?.[0];
      const bgColorStyle = subject?.colour
        ? { bgcolor: `${subject.colour}.500` }
        : {};
      return (
        <TableAvatar
          name={data?.name ?? ''}
          to={`./${data?.partyId ?? ''}`}
          avatarUrl={data?.avatarUrl}
          AvatarProps={{
            sx: {
              borderRadius: 1,
              ...bgColorStyle,
            },
          }}
        />
      );
    },
    sort: 'asc',
  },
  {
    field: 'subjects',
    headerName: t('common:subject'),
    filter: true,
    valueGetter: ({ data }) => {
      const [firstSubject] = data?.subjects || [];
      return firstSubject?.name;
    },
    enableRowGroup: true,
  },
  {
    field: 'irePP.level',
    headerName: t('common:level'),
    filter: true,
    editable: true,
    valueSetter: (params) => {
      set(params.data ?? {}, 'irePP.level', params.newValue);
      return true;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentsSubjectGroups, any>) =>
      data?.irePP?.level ? (
        <TableStudyLevelChip level={data.irePP.level} />
      ) : null,
    cellEditorSelector: StudyLevelSelectCellEditor(t),
    enableRowGroup: true,
  },
  {
    field: 'staff',
    headerName: t('common:teacher'),
    valueGetter: ({ data }) => displayNames(data?.staff),
    enableRowGroup: true,
  },
];

export default function StudentProfileClassesPage() {
  const { id } = useParams();
  const studentId = getNumber(id);
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const [selectedGroups, setSelectedGroups] = useState<RecipientsForSmsModal>(
    []
  );
  const { displayNames } = usePreferredNameLayout();
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const { data: subjectGroupsData } = useStudentsSubjectGroups(studentId);

  const studentColumns = useMemo(
    () => getSubjectGroupsColumns(t, displayNames),
    [t, displayNames]
  );

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(
    () => [
      {
        label: t('people:sendSms'),
        icon: <MobileIcon />,
        onClick: onOpenSendSms,
      },
    ],
    []
  );

  return (
    <>
      <Table
        rowData={subjectGroupsData ?? []}
        columnDefs={studentColumns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.partyId)}
        rightAdornment={
          <Fade in={selectedGroups.length > 0} unmountOnExit>
            <Box>
              <ActionMenu menuItems={actionMenuItems} />
            </Box>
          </Fade>
        }
        onRowSelection={(groups) =>
          setSelectedGroups(
            groups.map(({ partyId, name, avatarUrl, subjects }) => {
              const subject = subjects?.[0];
              return {
                id: partyId,
                name,
                type: 'group',
                avatarUrl,
                avatarColor: subject?.colour,
              };
            })
          )
        }
      />

      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={selectedGroups}
        possibleRecipientTypes={[
          {
            label: t('sms:teachersOfGroup', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.SubjectGroupStaff,
          },
        ]}
      />
    </>
  );
}
