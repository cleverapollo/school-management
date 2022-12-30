import Table from '../../../../components/table/Table';
import { TableColumn } from '../../../../components/table/types';
import {  Container, Typography } from "@mui/material";
import useLocales from "../../../../hooks/useLocales";
import Page from "../../../../components/Page";
import useSettings from "../../../../hooks/useSettings";
import {useCoreRooms} from "../api/rooms";
import { useMemo } from 'react';
import {Room} from "@tyro/api";
import {useLoaderData} from "react-router";


const getSubjectColumns = (translate: (text: any, options?: any) => never): TableColumn<Room>[] => ([
  {
    columnDisplayName: translate('Name'),
    fieldName: 'name',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('Capacity'),
    fieldName: 'capacity',
    filter: 'suggest',
  },
]);

export function Rooms() {

  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { data, isLoading } = useCoreRooms();

  const subjectGroupColumns = useMemo(() => getSubjectColumns(translate), [translate]);

  const rooms : Room[] = data as Room[]
  return (
    <Page title="Subject" isLoading={isLoading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Rooms
        </Typography>
          {rooms && <Table
          data={rooms}
          columns={subjectGroupColumns}
        />}
      </Container>
    </Page>
  );
}

export default Rooms;
