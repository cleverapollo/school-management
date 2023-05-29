import { Box, Stack } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { useBlockMembership } from '../api/blocks';
import { BlockAutocomplete } from '../components/blocks/block-autocomplete';
import { ListManager } from '../components/common/list-manager';
import { useContainerMargin } from '../hooks/use-container-margin';

export default function ClassListManagerBlocks() {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedRotationIndex, setSelectedRotationIndex] = useState<
    number | null
  >(null);
  const { data } = useBlockMembership(selectedBlock);
  const containerMargin = useContainerMargin();

  const blockData = useMemo(() => {
    const blockIndex =
      !data?.isRotation || selectedRotationIndex === null
        ? 0
        : selectedRotationIndex;

    return data ? data.groups[blockIndex] : null;
  }, [selectedRotationIndex, data?.groups]);

  useEffect(() => {
    setSelectedRotationIndex(null);
  }, []);

  console.log({
    selectedBlock,
    blockData,
  });

  return (
    <Stack spacing={3}>
      <BlockAutocomplete
        value={selectedBlock}
        onChange={setSelectedBlock}
        sx={{ px: containerMargin }}
      />
      {blockData && (
        <ListManager
          unassignedStudents={blockData.unenrolledStudents}
          groups={blockData.subjectGroups}
        />
      )}
    </Stack>
  );
}
