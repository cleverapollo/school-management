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
import { CustomGroup } from '../../../../app/api/generated';
import Page from '../../../../components/Page';
import useSettings from '../../../../hooks/useSettings';
import ColoredBox from '../../components/ColoredBox';
import { useCustomGroups } from '../../api/general-groups';

interface CustomGroupData extends CustomGroup {
  firstButton?: string;
  tech?: string;
}

const getCustomGroupColumns = (translate: (text: any, options?: any) => never, isAdminUserType: boolean): TableColumn<CustomGroupData>[] => ([
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
    columnDisplayName: translate('members'),
    fieldName: 'members',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('type'),
    fieldName: 'type',
    filter: 'suggest',
    isMandatory: true,
    component: (columnProps) => <ColoredBox content={columnProps.row.original.type} />
  },
  {
    columnDisplayName: translate('created'),
    fieldName: 'created',
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

const getStudentsCustomGroupColumns = (translate: (text: any, options?: any) => never): TableColumn<CustomGroupData>[] => ([
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
    columnDisplayName: translate('teacher'),
    fieldName: 'created',
    filter: 'suggest',
    isMandatory: true,
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
  },
]);

export default function CustomGroups() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { activeProfile } = useUser();
  const { data, isLoading } = useCustomGroups();
  const profileTypeName = activeProfile?.profileType?.name;
  const isAdminUserType = profileTypeName === PROFILE_TYPE_NAMES.ADMIN;
  const isFacultyOrAdmin = profileTypeName === PROFILE_TYPE_NAMES.ADMIN || profileTypeName === PROFILE_TYPE_NAMES.TEACHER;

  const customGroupData: CustomGroupData[] = data?.map(group => (
    {
      ...group,
      firstButton: translate('view'),
      tech: ''
    } as CustomGroupData)
  ) ?? [];

  const customGroupColumns = useMemo(() => isFacultyOrAdmin
    ? getCustomGroupColumns(translate, isAdminUserType)
    : getStudentsCustomGroupColumns(translate)
    , [translate, isAdminUserType, isFacultyOrAdmin]);

  return (
    <Page title="Custom groups" isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Custom groups
        </Typography>
        <Table
          data={customGroupData}
          columns={customGroupColumns}
          //ToDO: change navigate url to new one after spliting exact group pages by type
          onClickRow={(id) => { navigate(`./${id}/view`); }}
        />
      </Container>
    </Page>
  );
}
