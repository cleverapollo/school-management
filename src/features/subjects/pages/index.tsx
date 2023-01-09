import Table from '../../../components/table/Table';
import { TableColumn } from '../../../components/table/types';
import { Button, Container, Typography } from "@mui/material";
import { useTranslation } from '@tyro/i18n';
import ColoredBox from "../../groups/components/ColoredBox";
import Page from "../../../components/Page";
import useSettings from "../../../hooks/useSettings";
import { useSubjects } from "../api/subjects";
import { useMemo } from 'react';
import {Person, SubjectGroup} from '@tyro/api/src/gql/graphql';
import MultiPersonsAvatars from "../../groups/components/MultiPersonsAvatars";
import { TFunction } from 'i18next';

interface SubjectsData extends SubjectGroup {
  firstButton?: string;
  tech?: string;
}

const getSubjectColumns = (translate: TFunction): TableColumn<SubjectsData>[] => ([
  {
    columnDisplayName: translate('subject'),
    fieldName: 'subjects',
    filter: 'suggest',
    isMandatory: true,
    component: ({ row }) => {
      var subject = row.original.subjects?.find(() => true)
      return subject?.name
    }
  },
  {
    columnDisplayName: translate('level'),
    fieldName: 'irePP.level',
    filter: 'suggest',
    component: (columnProps) => <ColoredBox content={columnProps.row.original.irePP?.level ?? undefined} />
  },
  {
    columnDisplayName: translate('teacher'),
    fieldName: 'staff',
    filter: 'suggest',
    component: ({ row }) => {
      var teachers = row.original.staff as [Person]
      return <MultiPersonsAvatars person={teachers}/>
    }
  },
  {
    columnDisplayName: '',
    fieldName: 'firstButton',
    component: (columnProps) => {
      return (<Button onClick={() => { }}>
        {columnProps.row.original.firstButton}
      </Button>)
    }
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: 'tech',
  },
]);

export function Subjects() {
  const { t } = useTranslation(['common']);
  const { themeStretch } = useSettings();
  const { data, isLoading } = useSubjects();

  const subjectsData: SubjectsData[] = data?.map(group => {
    return {
      ...group,
      firstButton: t('view'),
      tech: ''
    } as SubjectsData || []
  }) || [];

  const subjectGroupColumns = useMemo(() => getSubjectColumns(t), [t]);

  return (
    <Page title="Subject" isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Subject
        </Typography>
        <Table
          data={subjectsData}
          columns={subjectGroupColumns}
        />
      </Container>
    </Page>
  );
}

export default Subjects;
