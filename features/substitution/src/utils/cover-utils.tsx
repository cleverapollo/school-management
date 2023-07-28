import { CoverEvent } from '../hooks/use-cover-table';

export function getCurrentCoverRoom({ event, substitution }: CoverEvent) {
  return (
    substitution?.substituteRoom?.name ??
    event.rooms?.map(({ name }) => name).join(', ') ??
    ''
  );
}
