import { useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  useNumber,
  Table,
  GridOptions,
  TablePersonAvatar,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  useListNavigatorSettings,
  ListNavigatorType,
  PartyListNavigatorMenuItemParams,
} from '@tyro/core';
import {
  useCustomGroupDefinition,
  ReturnTypeFromUseCustomGroupDefinition,
} from '../../../api';

type CustomGroupStaff = ReturnTypeFromUseCustomGroupDefinition['staff'][number];

const getColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  onBeforeNavigate: () => void,
  displayName: ReturnTypeDisplayName
): GridOptions<CustomGroupStaff>['columnDefs'] => [
  {
    colId: 'name',
    headerName: t('common:name'),
    sort: 'asc',
    valueGetter: ({ data }) => displayName(data),
    cellRenderer: ({ data }: ICellRendererParams<CustomGroupStaff>) =>
      data && (
        <TablePersonAvatar
          person={data}
          to={`/people/staff/${data?.partyId ?? ''}`}
          onBeforeNavigate={onBeforeNavigate}
        />
      ),
  },
];

export default function CustomGroupStaffPage() {
  const { t } = useTranslation(['common', 'people']);
  const { displayName } = usePreferredNameLayout();

  const { groupId } = useParams();
  const partyId = useNumber(groupId) ?? 0;

  const { data: customGroupData } = useCustomGroupDefinition({ partyId });

  const visibleDataRef = useRef<() => CustomGroupStaff[]>(null);

  const { storeList } =
    useListNavigatorSettings<PartyListNavigatorMenuItemParams>({
      type: ListNavigatorType.Staff,
    });

  const onBeforeNavigateProfile = useCallback(() => {
    storeList(
      customGroupData?.name,
      visibleDataRef.current?.().map((person) => ({
        id: person.partyId,
        type: 'person',
        name: displayName(person),
        firstName: person.firstName,
        lastName: person.lastName,
        avatarUrl: person.avatarUrl,
      }))
    );
  }, [customGroupData]);

  const columns = useMemo(
    () => getColumns(t, onBeforeNavigateProfile, displayName),
    [t, onBeforeNavigateProfile, displayName]
  );

  return (
    <Table
      visibleDataRef={visibleDataRef}
      rowData={customGroupData?.staff ?? []}
      columnDefs={columns}
      getRowId={({ data }) => String(data?.partyId)}
    />
  );
}
