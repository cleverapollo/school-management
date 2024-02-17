import { Card, CardHeader, Chip, Box } from '@mui/material';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import { useTranslation } from '@tyro/i18n';
import { getColorBasedOnIndex } from '@tyro/api';
import { PinIcon } from '@tyro/icons';
import { ReturnTypeFromUseOptionsSolveBlocks } from '../../../api/solve/blocks';

interface BlockOrganiserProps {
  subjectSet: NonNullable<
    ReturnTypeFromUseOptionsSolveBlocks['subjectSet'][number]
  >['subjectSet'];
  blocks: NonNullable<
    ReturnTypeFromUseOptionsSolveBlocks['subjectSet'][number]
  >['blocks'];
  onChangeBlocks: (
    subjectSetId: NonNullable<
      ReturnTypeFromUseOptionsSolveBlocks['subjectSet'][number]
    >['subjectSet']['id'],
    updatedBlocks: NonNullable<
      ReturnTypeFromUseOptionsSolveBlocks['subjectSet'][number]
    >['blocks']
  ) => void;
}

export function BlockOrganiser({
  subjectSet,
  blocks,
  onChangeBlocks,
}: BlockOrganiserProps) {
  const { t } = useTranslation(['subjectOptions']);

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    console.log(result, provided);
  };

  const toggleItemPin = (blockIndex: number, subjectGroupIndex: number) => {
    const newBlocks = [...blocks];
    const currentGroupValue =
      newBlocks[blockIndex].subjectGroups[subjectGroupIndex];

    newBlocks[blockIndex].subjectGroups[subjectGroupIndex] = {
      ...currentGroupValue,
      pinned: !currentGroupValue.pinned,
    };

    onChangeBlocks(subjectSet.id, newBlocks);
  };

  return (
    <Card>
      <CardHeader
        title={t('subjectOptions:poolXSubjectSetYBlocks', {
          x: subjectSet.poolIdx,
          y: subjectSet.name,
        })}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)' }}>
          {blocks.map((block, blockIndex) => (
            <Droppable
              key={block.blockIdx}
              droppableId={block.blockIdx.toString()}
              direction="horizontal"
            >
              {(provided, snapshot) => (
                <>
                  <Box>{block.name}</Box>
                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                    {block.subjectGroups.map(
                      ({ id, name, blockIdx, pinned }, index) => (
                        <Draggable
                          key={id}
                          draggableId={id.toString()}
                          index={index}
                        >
                          {(draggableProvided) => (
                            <Chip
                              ref={provided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              label={name}
                              color={getColorBasedOnIndex(blockIdx)}
                              onDelete={() => toggleItemPin(blockIndex, index)}
                              deleteIcon={
                                <Box>
                                  <PinIcon />
                                </Box>
                              }
                            />
                          )}
                        </Draggable>
                      )
                    )}
                    {provided.placeholder}
                  </Box>
                </>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Card>
  );
}
