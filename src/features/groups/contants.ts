import { Option } from "../../components/table/types";

export const adminOptions: Option[] = [
  {
    text: 'notify',
    icon: 'notify',
    action: (e) => {e.stopPropagation()},
  },
  {
    text: 'edit',
    icon: 'edit',
    action: (e) => {e.stopPropagation()},
  },
  {
    text: 'archive',
    icon: 'archive',
    action: (e) => {e.stopPropagation()},
  },
  {
    text: 'delete',
    icon: 'delete',
    action: (e) => {e.stopPropagation()},
  },
];

export const teacherOptions: Option[] = [
  {
    text: 'notify',
    icon: 'notify',
    action: (e) => {e.stopPropagation()},
  },
];
