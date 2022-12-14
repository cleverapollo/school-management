import Table from '../../../../../components/table/Table';
import {Option, TableColumn} from '../../../../../components/table/types';
import {Chip, Container, Typography} from "@mui/material";
import useLocales from "../../../../../hooks/useLocales";
import Page from "../../../../../components/Page";
import useSettings from "../../../../../hooks/useSettings";
import {useCoreAcademicNamespace} from "../../api/academicNamespaces";
import * as React from 'react';
import {useMemo, useState} from 'react';
import {AcademicNamespace} from "@tyro/api";
import OptionButton from "../../../../../components/table/OptionButton";

const actions: Option<AcademicNamespace>[] = [
    {
        text: 'Make Active Primary Namespace',
        icon: 'edit',
        action: (e, row) => {

        },
        confirmationDialog(row) {
            return {
                title: `Change Academic Namespace to ${row.year}?`,
                description: 'Doing this will change the year for everyone in the system. This is typically only done at the start on the new Academic Year',
                confirmText: `Change Academic Namespace to ${row.year}`,
                confirmFunction: () => new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('RESSSOLVED')
                        resolve();
                    }, 300);
                })

            }

        }
    },
];


const getColumns = (translate: (text: any, options?: any) => never): TableColumn<AcademicNamespace>[] => ([
    {
        columnDisplayName: translate('year'),
        fieldName: 'year',
        filter: 'suggest',
        isMandatory: true,
    },
    {
        columnDisplayName: translate('name'),
        fieldName: 'name',
        filter: 'suggest',
    },
    {
        columnDisplayName: translate('type'),
        fieldName: 'type',
        filter: 'suggest',
    },

    {
        columnDisplayName: translate('description'),
        fieldName: 'description',
        filter: 'suggest',
    },
    {
        columnDisplayName: translate(''),
        fieldName: 'isActiveDefaultNamespace',
        filter: 'suggest',
        component: (columnProps) => {
            return (
                <>
                    {columnProps.row.original.isActiveDefaultNamespace && <Chip label="Active"/>}
                </>
            );
        },
    },
    {
        columnDisplayName: 'Tech Options',
        fieldName: () => 'tech',
        component: (columnProps) => {
            return (
                <>

                    <OptionButton options={actions} row={columnProps.row.original}/>
                </>
            );
        },
    },
]);

export function AcademicNamespaceList() {

    const {translate} = useLocales();
    const {themeStretch} = useSettings();
    const {data, isLoading} = useCoreAcademicNamespace();

    const columns = useMemo(() => getColumns(translate), [translate]);


    const ns: AcademicNamespace[] = data as AcademicNamespace[]
    if (ns == null) {
        return <></>
    }
    ns.sort((a, b) => {
        if (a.isActiveDefaultNamespace) {
            return -1000
        }
        return a.year - b.year
    })
    return (
        <Page title="Subject" isLoading={isLoading}>
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h3" component="h1" paragraph>
                    Namespaces
                </Typography>
                <Table
                    data={ns}
                    columns={columns}
                />
            </Container>
        </Page>
    );
}

export default AcademicNamespaceList;
