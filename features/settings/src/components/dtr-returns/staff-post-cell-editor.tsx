import { TableSelect } from '@tyro/core';
import { useStaffPosts } from '@tyro/people/src/api/staff/staff-posts';

export function StaffPostSelectCellEditor() {
  const { data: postsData = [] } = useStaffPosts();

  const options = postsData.map((staffPost) => ({
    value: staffPost,
    label: staffPost.name,
  }));

  return () =>
    ({
      component: TableSelect<(typeof options)[number]>,
      popup: true,
      popupPosition: 'under',
      params: {
        options,
        optionIdKey: 'value',
        getOptionLabel: (option: (typeof options)[number]) => option.label,
      },
    } as const);
}
