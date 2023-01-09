import Table from '../../../../../components/table/Table';
import {Option, TableColumn} from '../../../../../components/table/types';
import {Chip, Container, Typography} from "@mui/material";
import { useTranslation } from '@tyro/i18n';
import Page from "../../../../../components/Page";
import useSettings from "../../../../../hooks/useSettings";
import {useCoreAcademicNamespace} from "../../api/academicNamespaces";
import * as React from 'react';
import {useMemo} from 'react';
import {
    AcademicNamespace,
    Core_SetActiveActiveAcademicNamespaceMutation,
    SetActiveAcademicNamespace
} from "@tyro/api";
import OptionButton from "../../../../../components/table/OptionButton";
import {
    CoreSetActiveActiveAcademicNamespaceWrapper,
    useCoreSetActiveActiveAcademicNamespace
} from "../../api/changeActiveAcademicNamespace";
import {UseMutationResult} from "@tanstack/react-query";
import { TFunction } from 'i18next';

interface SetActiveAcademicYearMutationContext  {
    mutation:  UseMutationResult<Core_SetActiveActiveAcademicNamespaceMutation, unknown, CoreSetActiveActiveAcademicNamespaceWrapper, unknown>
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
                    let value =
                        {
                            mutationBody: {
                                academicNamespaceId: row.academicNamespaceId
                            } as SetActiveAcademicNamespace,
                            displayChangeToYear: row.year
                        } as CoreSetActiveActiveAcademicNamespaceWrapper
                    return setActiveAcademicYear.mutation.mutateAsync(value)
                }
            }

        }
    },
] as  Option<AcademicNamespace>[]
};


const getColumns = (translate: TFunction, setActiveAcademicYear: SetActiveAcademicYearMutationContext): TableColumn<AcademicNamespace>[] => ([
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

    const { t } = useTranslation();
    const {themeStretch} = useSettings();
    const {data, isLoading} = useCoreAcademicNamespace();
    const mutation = useCoreSetActiveActiveAcademicNamespace()

    const columns = useMemo(() => getColumns(t, {mutation}), [t, mutation]);

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
