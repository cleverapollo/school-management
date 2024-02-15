import { useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  useNumber,
  Table,
  GridOptions,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
  useListNavigatorSettings,
  ListNavigatorType,
  PartyListNavigatorMenuItemParams,
} from '@tyro/core';
import { StudentTableAvatar } from '@tyro/people';
import { getPersonProfileLink } from '@tyro/api';
import {
  useCustomGroupDefinition,
  ReturnTypeFromUseCustomGroupDefinition,
} from '../../../api';

type CustomGroupStudent =
  ReturnTypeFromUseCustomGroupDefinition['students'][number];

const getColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  onBeforeNavigate: () => void,
  displayName: ReturnTypeDisplayName
): GridOptions<CustomGroupStudent>['columnDefs'] => [
  {
    field: 'person',
    headerName: t('common:name'),
    sort: 'asc',
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({ data }: ICellRendererParams<CustomGroupStudent>) =>
      data ? (
        <StudentTableAvatar
          person={data?.person}
          isPriorityStudent={!!data?.extensions?.priority}
          hasSupportPlan={false}
          to={getPersonProfileLink(data?.person)}
          onBeforeNavigate={onBeforeNavigate}
        />
      ) : null,
    cellClass: 'cell-value-visible',
  },
  {
    field: 'classGroup.name',
    headerName: t('common:classGroup'),
    enableRowGroup: true,
    valueGetter: ({ data }) => data?.classGroup?.name || '-',
  },
];

export default function CustomGroupStudentsPage() {
  const { t } = useTranslation(['common', 'people']);
  const { displayName } = usePreferredNameLayout();

  const { groupId } = useParams();
  const partyId = useNumber(groupId) ?? 0;

  const { data: customGroupData } = useCustomGroupDefinition({ partyId });

  const visibleDataRef = useRef<() => CustomGroupStudent[]>(null);

  const { storeList } =
    useListNavigatorSettings<PartyListNavigatorMenuItemParams>({
      type: ListNavigatorType.Student,
    });

  const onBeforeNavigateProfile = useCallback(() => {
    storeList(
      customGroupData?.name,
      visibleDataRef.current?.().map(({ person, classGroup }) => ({
        id: person.partyId,
        type: 'person',
        name: displayName(person),
        firstName: person.firstName,
        lastName: person.lastName,
        avatarUrl: person.avatarUrl,
        caption: classGroup?.name,
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
      rowData={customGroupData?.students ?? []}
      columnDefs={columns}
      getRowId={({ data }) => String(data?.person?.partyId)}
    />
  );
}
