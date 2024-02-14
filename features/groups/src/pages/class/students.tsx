import { useCallback, useMemo, useRef, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';
import { MobileIcon, SendMailIcon } from '@tyro/icons';
import {
  UseQueryReturnType,
  getPersonProfileLink,
  RecipientSearchType,
  PermissionUtils,
} from '@tyro/api';
import {
  useNumber,
  Table,
  GridOptions,
  ActionMenu,
  ICellRendererParams,
  useProfileListNavigation,
  ProfilePageNavigation,
  preferredNameLayoutUtils,
} from '@tyro/core';
import { StudentTableAvatar } from '@tyro/people';
import { useMailSettings } from '@tyro/mail';
import { useClassGroupById } from '../../api/class-groups';

type ReturnTypeFromUseSubjectGroupById = UseQueryReturnType<
  typeof useClassGroupById
>['students'][number];

const getClassGroupColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  onBeforeNavigate: () => void
): GridOptions<ReturnTypeFromUseSubjectGroupById>['columnDefs'] => [
  {
    field: 'person',
    headerName: t('common:name'),
    valueGetter: ({ data }) =>
      preferredNameLayoutUtils().displayName(data?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroupById, any>) =>
      data ? (
        <StudentTableAvatar
          person={data?.person}
          isPriorityStudent={!!data?.extensions?.priority}
          hasSupportPlan={false}
          to={getPersonProfileLink(data?.person)}
          onBeforeNavigate={onBeforeNavigate}
        />
      ) : null,
    cellClass: 'cell-value-visible',
    sort: 'asc',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    lockVisible: true,
  },
];

export default function ClassGroupStudentsPage() {
  const { t } = useTranslation(['common', 'people', 'mail']);

  const { groupId } = useParams();
  const groupIdAsNumber = useNumber(groupId);
  const { sendMailToParties } = useMailSettings();

  const [selectedMembers, setSelectedMembers] = useState<
    ReturnTypeFromUseSubjectGroupById[]
  >([]);

  const actionMenuItems = useMemo(
    () => [
      // {
      //   label: t('people:sendSms'),
      //   icon: <MobileIcon />,
      //   // TODO: add action logic
      //   onClick: () => {},
      // },
      {
        label: t('mail:sendMail'),
        icon: <SendMailIcon />,
        hasAccess: ({ isStaffUserHasAllPermissions }: PermissionUtils) =>
          isStaffUserHasAllPermissions([
            'ps:1:communications:write_mail',
            'api:communications:read:search_recipients',
          ]),
        onClick: () => {
          sendMailToParties(
            selectedMembers.map(({ person }) => person.partyId),
            [
              {
                label: t('mail:student', {
                  count: selectedMembers.length,
                }),
                type: RecipientSearchType.Student,
              },
              {
                label: t('mail:contactsOfStudent', {
                  count: selectedMembers.length,
                }),
                type: RecipientSearchType.StudentContacts,
              },
              {
                label: t('mail:teachersOfStudent', {
                  count: selectedMembers.length,
                }),
                type: RecipientSearchType.StudentTeachers,
              },
            ]
          );
        },
      },
    ],
    [t, selectedMembers, sendMailToParties]
  );

  const { data: groupData } = useClassGroupById(groupIdAsNumber);

  const groupName = groupData?.name || '';

  const visibleDataRef =
    useRef<() => ReturnTypeFromUseSubjectGroupById[]>(null);

  const { storeList } = useProfileListNavigation({
    profile: ProfilePageNavigation.Student,
  });

  const onBeforeNavigateProfile = useCallback(() => {
    storeList(
      groupName,
      visibleDataRef.current?.().map(({ person }) => ({
        partyId: person.partyId,
        person,
      }))
    );
  }, [groupName]);

  const classGroupColumns = useMemo(
    () => getClassGroupColumns(t, onBeforeNavigateProfile),
    [t, onBeforeNavigateProfile]
  );

  const showActionMenu = selectedMembers.length > 0;

  return (
    <Table
      visibleDataRef={visibleDataRef}
      rowData={groupData?.students ?? []}
      columnDefs={classGroupColumns}
      rowSelection="multiple"
      getRowId={({ data }) => String(data?.person?.partyId)}
      rightAdornment={
        <Fade in={showActionMenu} unmountOnExit>
          <Box>
            <ActionMenu menuItems={actionMenuItems} />
          </Box>
        </Fade>
      }
      onRowSelection={setSelectedMembers}
    />
  );
}
