import Table from '../../../../components/table/Table';
import { TableColumn } from '../../../../components/table/types';
import {  Container, Typography } from "@mui/material";
import useLocales from "../../../../hooks/useLocales";
import Page from "../../../../components/Page";
import useSettings from "../../../../hooks/useSettings";
import {useCatalogueSubjects} from "../api/subjects";
import { useMemo } from 'react';
import {Subject} from "@tyro/api";


const getColumns = (translate: (text: any, options?: any) => never): TableColumn<Subject>[] => ([
  {
    columnDisplayName: translate('Name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('Short Code'),
    fieldName: 'shortCode',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('Colour'),
    fieldName: 'colour',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('Icon'),
    fieldName: 'icon',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('National Code'),
    fieldName: 'nationalCode',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('Decription'),
    fieldName: 'description',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('Subject Type'),
    fieldName: 'subjectSource',
    filter: 'suggest',
  },
]);

export function Subjects() {

  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { data, isLoading } = useCatalogueSubjects();

  const columns = useMemo(() => getColumns(translate), [translate]);

  const subjects : Subject[] = data as Subject[]
  return (
    <Page title="Subject" isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Subjects
        </Typography>
          {subjects && <Table
          data={subjects}
          columns={columns}
        />}
      </Container>
    </Page>
  );
}

export default Subjects;
