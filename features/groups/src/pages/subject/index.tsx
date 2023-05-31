import { Box, Fade, Container, Typography } from '@mui/material';
import { SmsRecipientType, UpdateSubjectGroupInput } from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Page,
  Table,
  ICellRendererParams,
  ActionMenu,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  TableStudyLevelChip,
  StudyLevelSelectCellEditor,
  BulkEditedRows,
  TableAvatar,
  useDisclosure,
} from '@tyro/core';

import { MobileIcon, SendMailIcon } from '@tyro/icons';

import set from 'lodash/set';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import {
  useSaveSubjectGroupEdits,
  useSubjectGroups,
} from '../../api/subject-groups';

type ReturnTypeFromUseSubjectGroups = NonNullable<
  ReturnType<typeof useSubjectGroups>['data']
>[number];

const getSubjectGroupsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayNames: ReturnTypeDisplayNames
): GridOptions<ReturnTypeFromUseSubjectGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroups>) => {
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
    field: 'studentMembers.memberCount',
    headerName: t('common:members'),
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
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroups, any>) =>
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

export default function SubjectGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const { displayNames } = usePreferredNameLayout();

  const { data: subjectGroupsData } = useSubjectGroups();
  const { mutateAsync: updateSubjectGroup } = useSaveSubjectGroupEdits();

  const [selectedGroups, setSelectedGroups] = useState<RecipientsForSmsModal>(
    []
  );
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const studentColumns = useMemo(
    () => getSubjectGroupsColumns(t, displayNames),
    [t, displayNames]
  );

  const actionMenuItems = [
    {
      label: t('people:sendSms'),
      icon: <MobileIcon />,
      onClick: onOpenSendSms,
    },
    // {
    //   label: t('mail:sendMail'),
    //   icon: <SendMailIcon />,
    //   onClick: () => {},
    // },
  ];

  const handleBulkSave = (
    data: BulkEditedRows<ReturnTypeFromUseSubjectGroups, 'irePP.level'>
  ) => {
    const updates = Object.entries(data).reduce<UpdateSubjectGroupInput[]>(
      (acc, [partyId, changes]) => {
        const level = changes['irePP.level'];

        if (level) {
          acc.push({
            subjectGroupPartyId: Number(partyId),
            irePP: { level: level.newValue },
          });
        }

        return acc;
      },
      []
    );

    return updateSubjectGroup(updates);
  };

  return (
    <>
      <Page title={t('groups:subjectGroups')}>
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            {t('groups:subjectGroups')}
          </Typography>
          <Table
            rowData={subjectGroupsData ?? []}
            columnDefs={studentColumns}
            rowSelection="multiple"
            getRowId={({ data }) => String(data?.partyId)}
            onBulkSave={handleBulkSave}
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
        </Container>
      </Page>

      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={selectedGroups}
        possibleRecipientTypes={[
          {
            label: t('sms:contactsOfStudentMembers', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.YearGroupContact,
          },
          {
            label: t('sms:yearHeadsOfGroup', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.YearGroupStaff,
          },
        ]}
      />
    </>
  );
}
