import { useMemo } from 'react';
import Table from '../../../../components/table/Table';
import {Option, TableColumn} from '../../../../components/table/types';
import { Button, Container, Typography } from "@mui/material";
import { useTranslation, TFunction } from '@tyro/i18n';
import OptionButton from "../../../../components/table/OptionButton";
import { useNavigate } from "react-router";
import { GeneralGroup, UserType, useUser } from '@tyro/api';
import { useEnrolmentGroups } from "../../api/general-groups";
import Page from '../../../../components/Page';
import useSettings from '../../../../hooks/useSettings';

interface EnrolmentGroupData {
  name: GeneralGroup['name'],
  members: GeneralGroup['studentCount'],
  programme: string | null | undefined;
  year: string,
  tutor: string,
  yearhead: string,
  id: string,
  firstButton?: string;
  tech?: string;
}

export const adminOptions: Option<EnrolmentGroupData>[] = [
    {
        text: 'notify',
        icon: 'notify',
        action: (e) => {e.stopPropagation()},
    },
    {
        text: 'edit',
        icon: 'edit',
        action: (e) => {e.stopPropagation()},
    },
    {
        text: 'archive',
        icon: 'archive',
        action: (e) => {e.stopPropagation()},
    },
    {
        text: 'delete',
        icon: 'delete',
        action: (e) => {e.stopPropagation()},
    },
];

const getEnrolmentGroupColumns = (translate: TFunction<("common" | "authentication")[], undefined, ("common" | "authentication")[]>, isAdminUserType: boolean): TableColumn<EnrolmentGroupData>[] => ([
  {
    columnDisplayName: 'id',
    fieldName: 'id',
  },
  {
    columnDisplayName: translate('common:name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('common:members'),
    fieldName: 'members',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('authentication:year'),
    fieldName: 'year',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('authentication:tutor'),
    fieldName: 'tutor',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('authentication:yearhead'),
    fieldName: 'yearhead',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('authentication:programme'),
    fieldName: 'programme',
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
    component: (columnProps) => {
      return isAdminUserType && (
        <OptionButton options={adminOptions} />
      );
    },
  },
]);

export default function EnrolmentGroups() {
  const { t } = useTranslation(['common', 'authentication']);
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { activeProfile } = useUser();
  const { data, isLoading } = useEnrolmentGroups();
  const profileTypeName = activeProfile?.profileType?.userType;
  const isAdminUserType = profileTypeName === UserType.Admin;

  const enrolmentGroupColumns = useMemo(() => getEnrolmentGroupColumns(t, isAdminUserType), [t, isAdminUserType]);

  const enrolmentGroupData: EnrolmentGroupData[] = data?.map(group => (
    {
      ...group,
      firstButton: isAdminUserType ? t('authentication:view') : t('authentication:notify'),
      tech: ''
    } as EnrolmentGroupData) || []
  ) || [];

  return (
    <Page title="Enrolment groups" isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Enrolment groups
        </Typography>
        <Table
          data={enrolmentGroupData}
          columns={enrolmentGroupColumns}
          //ToDO: change navigate url to new one after spliting exact group pages by type
          onClickRow={(id) => { navigate(`./${id}/view`); }}
        />
      </Container>
    </Page>
  );
}
