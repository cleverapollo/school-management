export * from './routes';
export {
  getSubjectGroupById,
  useSubjectGroupById,
  useSubjectGroups,
} from './api/subject-groups';
export { groupsKeys } from './api/keys';
export type {
  ReturnTypeFromUseYearGroups,
  ReturnTypeFromUseYearGroupById,
} from './api/year-groups';
export {
  getYearGroups,
  useYearGroups,
  useYearGroupById,
} from './api/year-groups';
export { useBlocksList } from './api/blocks-list';
export * from './components/common/year-group-autocomplete';
export * from './components/common/class-group-autocomplete';
export * from './components/common/block-autocomplete';
