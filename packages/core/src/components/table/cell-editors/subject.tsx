import { CatalogueSubjectOption } from '@tyro/settings';
import { TableSelect } from './select';

export function SubjectSelectCellEditor(
  subjects: CatalogueSubjectOption[] = []
) {
  return {
    component: TableSelect<(typeof subjects)[number]>,
    popup: true,
    popupPosition: 'under',
    params: {
      options: subjects,
      optionIdKey: 'id',
      getOptionLabel: (option: (typeof subjects)[number]) => option.name,
    },
  } as const;
}
