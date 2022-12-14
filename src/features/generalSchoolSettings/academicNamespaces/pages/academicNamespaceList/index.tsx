import Table from '../../../../../components/table/Table';
import {Option, TableColumn} from '../../../../../components/table/types';
import {Chip, Container, Typography} from "@mui/material";
import useLocales from "../../../../../hooks/useLocales";
import Page from "../../../../../components/Page";
import useSettings from "../../../../../hooks/useSettings";
import {useCoreAcademicNamespace} from "../../api/academicNamespaces";
import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {AcademicNamespace, Core_SetActiveActiveAcademicNamespaceMutation, SetActiveAcademicNamespace} from "@tyro/api";
import OptionButton from "../../../../../components/table/OptionButton";
import {useCoreSetActiveActiveAcademicNamespace} from "../../api/changeActiveAcademicNamespace";
import {QueryClient, UseMutationResult, useQueryClient} from "@tanstack/react-query";

interface SetActiveAcademicYearMutationContext  {
    mutation:  UseMutationResult<Core_SetActiveActiveAcademicNamespaceMutation, unknown, SetActiveAcademicNamespace, unknown>
    queryClient: QueryClient
}
const actions = (setActiveAcademicYear:  SetActiveAcademicYearMutationContext) =>  {

    return [
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
                confirmFunction: () => {
                    let value = {
                        academicNamespaceId: row.academicNamespaceId
                    } as SetActiveAcademicNamespace
                    console.log(value)
                    return setActiveAcademicYear.mutation.mutateAsync(value, {
                        onSuccess: (a, b) => {
                            console.log(`Successfully changed year to ${a.core_setActiveActiveAcademicNamespace?.year}`)
                            setActiveAcademicYear.queryClient.clear()
                        },
                        onError: (a, b) => {
                            console.log(`Failed changing year to ${row.year}`)
                        }
                    }
                )
                }
            }

        }
    },
] as  Option<AcademicNamespace>[]
};


const getColumns = (translate: (text: any, options?: any) => never, setActiveAcademicYear: SetActiveAcademicYearMutationContext): TableColumn<AcademicNamespace>[] => ([
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

                    <OptionButton options={actions(setActiveAcademicYear)} row={columnProps.row.original}/>
                </>
            );
        },
    },
]);

export function AcademicNamespaceList() {

    const {translate} = useLocales();
    const {themeStretch} = useSettings();
    const {data, isLoading} = useCoreAcademicNamespace();
    const [switchActiveAcademicYear, setSwitchActiveAcademicYear] = useState<SetActiveAcademicNamespace | null>(null);
    const mutation = useCoreSetActiveActiveAcademicNamespace()
    const queryClient = useQueryClient()

    const columns = useMemo(() => getColumns(translate, {mutation, queryClient}), [translate]);


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
