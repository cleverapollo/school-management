/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Chip, Container, Typography } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useMemo } from 'react';
import {
  AcademicNamespace,
  Core_SetActiveActiveAcademicNamespaceMutation,
  SetActiveAcademicNamespace,
} from '@tyro/api';
import { UseMutationResult } from '@tanstack/react-query';
import { Page } from '@tyro/core';
import OptionButton from '../../../../src/components/table/OptionButton';
import { Option, TableColumn } from '../../../../src/components/table/types';
import Table from '../../../../src/components/table/Table';
import { useCoreAcademicNamespace } from '../api/academic-namespaces/academic-namespaces';
import {
  CoreSetActiveActiveAcademicNamespaceWrapper,
  useCoreSetActiveActiveAcademicNamespace,
} from '../api/academic-namespaces/change-active-academic-namespace';

interface SetActiveAcademicYearMutationContext {
  mutation: UseMutationResult<
    Core_SetActiveActiveAcademicNamespaceMutation,
    unknown,
    CoreSetActiveActiveAcademicNamespaceWrapper,
    unknown
  >;
}
const actions = (setActiveAcademicYear: SetActiveAcademicYearMutationContext) =>
  [
    {
      text: 'Make Active Primary Namespace',
      icon: 'edit',
      action: (e, row) => {},
      confirmationDialog(row) {
        return {
          title: `Change Academic Namespace to ${row.year}?`,
          description:
            'Doing this will change the year for everyone in the system. This is typically only done at the start on the new Academic Year',
          confirmText: `Change Academic Namespace to ${row.year}`,
          confirmFunction: () => {
            const value = {
              mutationBody: {
                academicNamespaceId: row.academicNamespaceId,
              } as SetActiveAcademicNamespace,
              displayChangeToYear: row.year,
            } as CoreSetActiveActiveAcademicNamespaceWrapper;
            return setActiveAcademicYear.mutation.mutateAsync(value);
          },
        };
      },
    },
  ] as Option<AcademicNamespace>[];

const getColumns = (
  translate: TFunction<('common' | 'academicNamespaces')[], undefined, ('common' | 'academicNamespaces')[]>,
  setActiveAcademicYear: SetActiveAcademicYearMutationContext
): TableColumn<AcademicNamespace>[] => [
  {
    columnDisplayName: translate('common:year'),
    fieldName: 'year',
    filter: 'suggest',
    isMandatory: true,
  },
  {
    columnDisplayName: translate('common:name'),
    fieldName: 'name',
    filter: 'suggest',
  },
  {
    columnDisplayName: translate('common:type'),
    fieldName: 'type',
    filter: 'suggest',
  },

  {
    columnDisplayName: translate('common:description'),
    fieldName: 'description',
    filter: 'suggest',
  },
  {
    columnDisplayName: '',
    fieldName: 'isActiveDefaultNamespace',
    filter: 'suggest',
    component: (columnProps) =>
      columnProps.row.original.isActiveDefaultNamespace && (
        <Chip label={translate('academicNamespaces:active')} />
      ),
  },
  {
    columnDisplayName: 'Tech Options',
    fieldName: () => 'tech',
    component: (columnProps) => (
      <OptionButton
        options={actions(setActiveAcademicYear)}
        row={columnProps.row.original}
      />
    ),
  },
];

export default function AcademicNamespaceList() {
  const { t } = useTranslation(['common', 'academicNamespaces', 'subjects']);
  const { data, isLoading } = useCoreAcademicNamespace();
  const mutation = useCoreSetActiveActiveAcademicNamespace();

  const columns = useMemo(() => getColumns(t, { mutation }), [t, mutation]);

  const ns: AcademicNamespace[] = data as AcademicNamespace[];
  if (ns === null) {
    return null;
  }
  ns.sort((a, b) => {
    if (a.isActiveDefaultNamespace) {
      return -1000;
    }
    return a.year - b.year;
  });
  return (
    <Page title={t('subjects:subject')} isLoading={isLoading}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('academicNamespaces:namespaces')}
        </Typography>
        <Table data={ns} columns={columns} />
      </Container>
    </Page>
  );
}
