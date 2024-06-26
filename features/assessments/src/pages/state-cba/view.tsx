import { useCallback, useMemo, useRef, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  ICellRendererParams,
  Table,
  TableLinearProgress,
  TableBooleanValue,
  useNumber,
  PageContainer,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  useResponsive,
  useDisclosure,
  ActionMenu,
  ActionMenuProps,
  ListNavigatorType,
  ListNavigator,
  useListNavigatorSettings,
  BasicListNavigatorMenuItemParams,
  BasicListNavigatorMenuItem,
  PartyListNavigatorMenuItemParams,
} from '@tyro/core';
import {
  AssessmentType,
  Search,
  SearchType,
  SmsRecipientType,
  SyncStatus,
  usePermissions,
} from '@tyro/api';
import { Link, useParams } from 'react-router-dom';
import { Box, Button, Chip, ChipProps, Fade, Typography } from '@mui/material';
import { MobileIcon, SendMailIcon, SyncIcon } from '@tyro/icons';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { useMailSettings } from '@tyro/mail';
import { useAssessmentById, useAssessments } from '../../api/assessments';
import { useAssessmentResults } from '../../api/assessment-results';
import {
  useAssessmentSubjectGroups,
  ReturnTypeFromUseAssessmentSubjectGroups,
} from '../../api/assessment-subject-groups';
import { SyncWithPpodModal } from '../../components/state-cba/sync-with-ppod-modal';
import { assessmentUrlPathBasedOnType } from '../../utils/get-assessment-subject-groups-link';

const getColumnDefs = (
  isDesktop: boolean,
  t: TFunction<
    ('common' | 'assessments')[],
    undefined,
    ('common' | 'assessments')[]
  >,
  onBeforeNavigate: () => void,
  displayNames: ReturnTypeDisplayNames
): GridOptions<ReturnTypeFromUseAssessmentSubjectGroups>['columnDefs'] => [
  {
    field: 'subjectGroup.name',
    headerName: t('assessments:subjectGroup'),
    sort: 'asc',
    suppressSizeToFit: isDesktop,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
  },
  {
    field: 'resultsTotal',
    headerName: t('assessments:results'),
    suppressSizeToFit: true,
    valueGetter: ({ data }) =>
      data && `${data?.resultsEntered ?? '-'}/${data?.resultsTotal ?? '-'}`,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) => (
      <TableLinearProgress
        value={data?.resultsEntered}
        total={data?.resultsTotal}
      />
    ),
  },
  {
    field: 'subjectGroup.staff',
    headerName: t('common:teacher'),
    valueGetter: ({ data }) => displayNames(data?.subjectGroup.staff),
    enableRowGroup: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) =>
      data && (
        <Typography component="span" variant="body2" noWrap>
          {displayNames(data?.subjectGroup.staff)}
        </Typography>
      ),
  },
  {
    field: 'ppodSyncStatus',
    headerName: t('assessments:ppodStatus'),
    valueGetter: ({ data }) => data?.ppodSyncStatus || '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups, any>) => {
      const status = data?.ppodSyncStatus;
      const codeTypeColorMapping: Record<SyncStatus, ChipProps['color']> = {
        [SyncStatus.FullySynced]: 'success',
        [SyncStatus.PartiallySynced]: 'yellow',
        [SyncStatus.NotSynced]: 'error',
      };
      if (status) {
        return (
          <Chip
            label={t(`assessments:syncStatus.${status}`)}
            variant="soft"
            color={codeTypeColorMapping[status]}
          />
        );
      }
    },
  },
  {
    field: 'published',
    headerName: t('assessments:publishedOnline'),
    enableRowGroup: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) => {
      const isPublished = data?.published ?? false;
      return isPublished ? <TableBooleanValue value={isPublished} /> : '-';
    },
  },
  {
    colId: 'editResults',
    headerName: '',
    suppressSizeToFit: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups, any>) =>
      data && (
        <Button
          className="ag-show-on-row-interaction"
          component={Link}
          to={`./subject-group/${data.subjectGroup.partyId}`}
          onClick={onBeforeNavigate}
        >
          {t('assessments:actions.editResults')}
        </Button>
      ),
  },
];

export default function ViewStateCba() {
  const { hasPermission } = usePermissions();
  const { t } = useTranslation([
    'assessments',
    'common',
    'people',
    'sms',
    'mail',
  ]);
  const { academicNamespaceId, assessmentId } = useParams();
  const academicNameSpaceIdAsNumber = useNumber(academicNamespaceId);
  const assessmentIdAsNumber = useNumber(assessmentId);
  const { displayName, displayNames } = usePreferredNameLayout();
  const isDesktop = useResponsive('up', 'md');
  const [selectedAssessments, setSelectedAssessments] = useState<
    ReturnTypeFromUseAssessmentSubjectGroups[]
  >([]);

  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const {
    isOpen: isSyncWithPpodOpen,
    onOpen: onSyncWithPpodOpen,
    onClose: onCloseSyncWithPpod,
  } = useDisclosure();

  const { composeEmail } = useMailSettings();

  const { data: assessmentData } = useAssessmentById({
    academicNameSpaceId: academicNameSpaceIdAsNumber ?? 0,
    ids: [assessmentIdAsNumber ?? 0],
  });
  const { data: assessmentSubjectGroupsData = [] } = useAssessmentSubjectGroups(
    academicNameSpaceIdAsNumber ?? 0,
    {
      assessmentId: assessmentIdAsNumber,
    }
  );

  const subjectGroupIds = assessmentSubjectGroupsData?.map(
    (subject) => subject?.subjectGroup?.partyId
  );

  const assessmentResultsFilter = {
    assessmentId: assessmentIdAsNumber ?? 0,
    subjectGroupIds,
  };
  const { data: studentResults } = useAssessmentResults(
    academicNameSpaceIdAsNumber ?? 0,
    assessmentResultsFilter
  );

  const staffFromSelectedGroups = useMemo(() => {
    const uniqueStaffList = selectedAssessments.reduce(
      (acc, { subjectGroup }) => {
        subjectGroup.staff.forEach((staff) => {
          acc.set(staff.partyId, {
            name: displayName(staff),
            id: staff.partyId,
            type: 'individual',
            avatarUrl: staff?.avatarUrl,
          });
        });
        return acc;
      },
      new Map<number, RecipientsForSmsModal[number]>()
    );

    return Array.from(uniqueStaffList.values());
  }, [selectedAssessments]);

  const sendMailToSelectedStaff = () => {
    const uniqueStaffList = selectedAssessments.reduce(
      (acc, { subjectGroup }) => {
        subjectGroup.staff.forEach((staff) => {
          acc.set(staff.partyId, {
            partyId: staff.partyId,
            type: SearchType.Staff,
            text: displayName(staff),
            avatarUrl: staff?.avatarUrl,
          });
        });
        return acc;
      },
      new Map<number, Omit<Search, 'meta'>>()
    );

    composeEmail({
      canReply: false,
      bccRecipients: Array.from(uniqueStaffList.values()),
    });
  };

  const visibleDataRef =
    useRef<() => ReturnTypeFromUseAssessmentSubjectGroups[]>(null);

  const { storeList } =
    useListNavigatorSettings<PartyListNavigatorMenuItemParams>({
      type: ListNavigatorType.SubjectGroup,
    });

  const onBeforeNavigateProfile = useCallback(() => {
    storeList(
      assessmentData?.name,
      visibleDataRef.current?.().map(({ subjectGroup }) => {
        const subject = subjectGroup?.subjects?.[0];
        const bgColorStyle = subject?.colour
          ? { bgcolor: `${subject.colour}.500` }
          : {};

        return {
          id: subjectGroup.partyId,
          name: subjectGroup.name,
          type: 'group',
          avatarProps: {
            sx: {
              ...bgColorStyle,
            },
          },
        };
      })
    );
  }, [assessmentData]);

  const columnDefs = useMemo(
    () => getColumnDefs(!!isDesktop, t, onBeforeNavigateProfile, displayNames),
    [t, onBeforeNavigateProfile, displayNames]
  );

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(
    () => [
      [
        {
          label: t('people:sendSms'),
          icon: <MobileIcon />,
          onClick: onOpenSendSms,
          hasAccess: ({ isStaffUserWithPermission }) =>
            isStaffUserWithPermission('ps:1:communications:send_sms'),
        },
        {
          label: t('mail:sendMail'),
          icon: <SendMailIcon />,
          onClick: sendMailToSelectedStaff,
          hasAccess: ({ isStaffUserHasAllPermissions }) =>
            isStaffUserHasAllPermissions([
              'ps:1:communications:write_mail',
              'api:communications:read:search_recipients',
            ]),
        },
      ],
      [
        {
          label: t('assessments:syncWithPpod'),
          icon: <SyncIcon />,
          onClick: onSyncWithPpodOpen,
          hasAccess: () => hasPermission('ps:1:assessment:cba_sync_ppod'),
        },
      ],
    ],
    [t, hasPermission, staffFromSelectedGroups, isSendSmsOpen]
  );

  const { data: assessmentsData = [] } = useAssessments({
    academicNameSpaceId: academicNameSpaceIdAsNumber ?? 0,
  });

  const defaultListData = useMemo(
    () =>
      assessmentsData.map<
        BasicListNavigatorMenuItemParams & { type: AssessmentType }
      >(({ id, name, assessmentType }) => ({
        id,
        name,
        type: assessmentType,
        caption: assessmentType
          ? t(`assessments:assessmentTypes.${assessmentType}`)
          : undefined,
      })),
    [assessmentsData]
  );

  return (
    <>
      <PageContainer
        title={t('assessments:pageTitle.termAssessmentSubjectGroups')}
      >
        <ListNavigator<
          BasicListNavigatorMenuItemParams & { type: AssessmentType }
        >
          type={ListNavigatorType.Assessment}
          itemId={assessmentIdAsNumber}
          optionTextKey="name"
          getRenderOption={BasicListNavigatorMenuItem}
          estimateElementSize={52}
          defaultListData={defaultListData}
          getNavigationUrl={({ currentLocation, currentItem, newItem }) => {
            const currentTypePath =
              assessmentUrlPathBasedOnType[currentItem?.type];
            const newTypePath = assessmentUrlPathBasedOnType[newItem?.type];
            return currentLocation.pathname
              .replace(currentTypePath, newTypePath)
              .replace(`${currentItem?.id}`, `${newItem?.id}`);
          }}
          pageHeadingProps={{
            title: t('assessments:pageHeading.termAssessmentSubjectGroups', {
              name: assessmentData?.name,
            }),
            breadcrumbs: {
              links: [
                {
                  name: t('assessments:pageHeading.assessments'),
                  href: '/assessments',
                },
                {
                  name: t(
                    'assessments:pageHeading.termAssessmentSubjectGroups',
                    {
                      name: assessmentData?.name,
                    }
                  ),
                },
              ],
            },
          }}
        />
        <Table
          visibleDataRef={visibleDataRef}
          rowData={assessmentSubjectGroupsData || []}
          columnDefs={columnDefs}
          getRowId={({ data }) => String(data?.subjectGroup.partyId)}
          onRowSelection={setSelectedAssessments}
          rowSelection="multiple"
          rightAdornment={
            <Fade in={selectedAssessments.length > 0} unmountOnExit>
              <Box>
                <ActionMenu menuItems={actionMenuItems} />
              </Box>
            </Fade>
          }
          onFirstDataRendered={(params) => {
            params.columnApi.autoSizeColumns([
              'subjectGroup.name',
              'resultsTotal',
              'commentsTotal',
              'editResults',
            ]);
            params.api.sizeColumnsToFit();
          }}
        />
      </PageContainer>
      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={staffFromSelectedGroups}
        possibleRecipientTypes={[
          {
            label: t('sms:teachersOfGroup', {
              count: staffFromSelectedGroups.length,
            }),
            type: SmsRecipientType.Staff,
          },
        ]}
      />
      <SyncWithPpodModal
        isOpen={isSyncWithPpodOpen}
        onClose={onCloseSyncWithPpod}
        initialState={selectedAssessments}
        assessmentId={assessmentIdAsNumber}
        studentResults={studentResults}
      />
    </>
  );
}
