import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  ICellRendererParams,
  Table,
  TableLinearProgress,
  useNumber,
  PageContainer,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  useResponsive,
  useDisclosure,
  ActionMenu,
  ListNavigatorType,
  ListNavigator,
  PartyListNavigatorMenuItemParams,
  useListNavigatorSettings,
  BasicListNavigatorMenuItemParams,
  BasicListNavigatorMenuItem,
} from '@tyro/core';
import {
  AssessmentType,
  Search,
  SearchType,
  SmsRecipientType,
} from '@tyro/api';
import { Link, useParams } from 'react-router-dom';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Box, Button, Fade, Typography } from '@mui/material';
import { MobileIcon, SendMailIcon } from '@tyro/icons';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { useMailSettings } from '@tyro/mail';
import {
  useAssessmentSubjectGroups,
  ReturnTypeFromUseAssessmentSubjectGroups,
} from '../../api/assessment-subject-groups';
import { useAssessmentById, useAssessments } from '../../api/assessments';
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
    headerName: t('common:name'),
    sort: 'asc',
    suppressSizeToFit: isDesktop,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
  },
  {
    field: 'subjectGroup.subjects',
    headerName: t('common:subject'),
    valueGetter: ({ data }) =>
      data?.subjectGroup.subjects
        ?.map((subject) => subject?.name ?? '')
        .join(', '),
    enableRowGroup: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) =>
      data && (
        <Typography component="span" variant="body2" noWrap>
          {data?.subjectGroup.subjects
            ?.map((subject) => subject?.name ?? '')
            .join(', ')}
        </Typography>
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
    headerName: t('common:year'),
    field: 'subjectGroup.yearGroups',
    enableRowGroup: true,
    filter: true,
    valueGetter: ({ data }) =>
      data?.subjectGroup.yearGroups
        ?.sort((a, b) => a.yearGroupId - b.yearGroupId)
        .map((year) => year?.name)
        .join(', '),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) =>
      data && (
        <Typography component="span" variant="body2" noWrap>
          {data?.subjectGroup.yearGroups
            ?.sort((a, b) => a.yearGroupId - b.yearGroupId)
            .map((year) => year?.name)
            .join(', ')}
        </Typography>
      ),
  },
  {
    field: 'resultsTotal',
    headerName: t('assessments:results'),
    suppressSizeToFit: true,
    valueGetter: ({ data }) =>
      data && `${data?.resultsEntered ?? '-'}/${data?.resultsTotal ?? '-'}`,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) =>
      data && (
        <TableLinearProgress
          value={data?.resultsEntered}
          total={data?.resultsTotal}
        />
      ),
  },
  {
    field: 'commentsTotal',
    headerName: t('assessments:comments'),
    suppressSizeToFit: true,
    valueGetter: ({ data }) =>
      data && `${data?.commentsEntered ?? '-'}/${data?.commentsTotal ?? '-'}`,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAssessmentSubjectGroups>) =>
      data && (
        <TableLinearProgress
          value={data?.commentsEntered}
          total={data?.commentsTotal}
        />
      ),
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

export default function ViewTermAssessment() {
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
  const [selectedAssessments, setSelectedAssessments] = useState<
    ReturnTypeFromUseAssessmentSubjectGroups[]
  >([]);

  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
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

  const isDesktop = useResponsive('up', 'md');
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
          estimateElementSize={52}
          getRenderOption={BasicListNavigatorMenuItem}
          defaultListData={defaultListData}
          optionTextKey="name"
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
                <ActionMenu
                  menuItems={[
                    {
                      label: t('people:sendSms'),
                      icon: <MobileIcon />,
                      onClick: onOpenSendSms,
                      hasAccess: ({ isStaffUserWithPermission }) =>
                        isStaffUserWithPermission(
                          'ps:1:communications:send_sms'
                        ),
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
                  ]}
                />
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
    </>
  );
}
