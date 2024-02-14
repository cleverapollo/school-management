import { useMemo } from 'react';
import { useBehaviourLevels } from '../api/behaviour/behaviour-levels';

export function useBehaviourLevelByName() {
  const { data: behaviourLevels = [] } = useBehaviourLevels({});

  const behaviourLevelMapByName = useMemo(
    () =>
      new Map(
        behaviourLevels.map((behaviourLevel) => [
          behaviourLevel.name,
          behaviourLevel,
        ])
      ),
    [behaviourLevels]
  );

  return {
    getBehaviourLevelByName: (name: string) =>
      behaviourLevelMapByName.get(name),
  };
}
