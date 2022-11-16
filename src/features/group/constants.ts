import { Option } from "../../components/table/types";

export const enrolmentOptions: Option[] = [
  {
    text: 'notify',
    icon: 'notify',
    action: (e) => {e.stopPropagation()},
  },
  {
    text: 'view profile',
    icon: 'edit',
    action: (e) => {e.stopPropagation()},
  },
  {
    text: 'view timetable',
    icon: 'edit',
    action: (e) => {e.stopPropagation()},
  },
];

export const subjectOptions: Option[] = [
  {
    text: 'notify',
    icon: 'notify',
    action: (e) => {e.stopPropagation()},
  },
  {
    text: 'view',
    icon: 'edit',
    action: (e) => {e.stopPropagation()},
  },
];

export const customOptions: Option[] = [
  {
    text: 'notify',
    icon: 'notify',
    action: (e) => {e.stopPropagation()},
  },
  {
    text: 'view',
    icon: 'edit',
    action: (e) => {e.stopPropagation()},
  },
  {
    text: 'remove',
    icon: 'delete',
    action: (e) => {e.stopPropagation()},
  },
];
