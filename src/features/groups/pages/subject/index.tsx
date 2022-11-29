import Table from '../../../../components/table/Table';
import { TableColumn } from '../../../../components/table/types';
import { Button, Container, Typography } from "@mui/material";
import useLocales from "../../../../hooks/useLocales";
import { PROFILE_TYPE_NAMES } from "../../../../constants";
import OptionButton from "../../../../components/table/OptionButton";
import { adminOptions, teacherOptions } from "../../contants";
import { useNavigate } from "react-router";
import { useUser } from '@tyro/api';
import { useMemo } from 'react';
import { SubjectGroup } from '../../../../app/api/generated';
import Page from '../../../../components/Page';
import useSettings from '../../../../hooks/useSettings';
import { useSubjectGroups } from '../../api/subject-groups';
import ColoredBox from '../../components/ColoredBox';

interface SubjectGroupData extends SubjectGroup {
  firstButton?: string;
  tech?: string;
}

const getSubjectGroupColumns = (translate: (text: any, options?: any) => never, isAdminUserType: boolean, isTabsNeeded: boolean): TableColumn<SubjectGroupData>[] => ([
  {
    columnDisplayName: 'id',
    fieldName: 'id',
  },
  {
    columnDisplayName: translate('name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('subject'),
    fieldName: 'subject',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('members'),
    fieldName: 'members',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('level'),
    fieldName: 'level',
    filter: 'suggest',
    component: ({ row }) => <ColoredBox content={row.original.level ?? undefined} />
  },
  {
    columnDisplayName: isAdminUserType ? translate('teacher') : translate('programme'),
    fieldName: isAdminUserType ? 'teacher' : 'programme',
    filter: 'suggest',
  },
  {
    columnDisplayName: '',
    fieldName: 'firstButton',
    component: (columnProps) => {
      return (<Button onClick={(e) => { e.stopPropagation() }}>
        {columnProps.row.original.firstButton}
      </Button>)
    }
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
    component: () => {
      return isTabsNeeded && (
        <OptionButton options={isAdminUserType ? adminOptions : teacherOptions} />
      );
    },
  },
]);

export default function SubjectGroups() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { activeProfile } = useUser();
  const { data, isLoading } = useSubjectGroups();
  const profileTypeName = activeProfile?.profileType?.name;
  const isAdminUserType = profileTypeName === PROFILE_TYPE_NAMES.ADMIN;
  const isTabsNeeded = profileTypeName === PROFILE_TYPE_NAMES.ADMIN || profileTypeName === PROFILE_TYPE_NAMES.TEACHER;

  const subjectGroupData: SubjectGroupData[] = data?.map(group => {
    return {
      ...group,
      teacher: isAdminUserType ? group.teacher : undefined,
      programme: isAdminUserType ? undefined : group.programme,
      firstButton: translate('view'),
      tech: ''
    } as SubjectGroupData || []
  }) || [];

  const subjectGroupColumns = useMemo(() => getSubjectGroupColumns(translate, isAdminUserType, isTabsNeeded), [translate, isAdminUserType, isTabsNeeded]);

  return (
    <Page title="Subject groups" isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Subject groups
        </Typography>
        <Table
          data={subjectGroupData}
          columns={subjectGroupColumns}
          //ToDO: change navigate url to new one after spliting exact group pages by type
          onClickRow={(id) => { navigate(`./${id}/view`); }}
        />
      </Container>
    </Page>
  );
}
