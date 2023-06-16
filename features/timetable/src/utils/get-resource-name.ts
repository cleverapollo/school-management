import { Lesson } from '../hooks/use-resource-table';

export function getResourceName(lesson: Lesson) {
  const partyGroup = lesson?.partyGroup;
  const subject =
    partyGroup.__typename === 'SubjectGroup' ? partyGroup.subjects[0] : null;
  return subject?.name ?? partyGroup.name;
}
