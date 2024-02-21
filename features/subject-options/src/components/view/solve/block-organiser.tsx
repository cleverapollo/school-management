import { Card, Chip, Box, Stack, useTheme } from '@mui/material';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { useTranslation } from '@tyro/i18n';
import { getColorBasedOnIndex } from '@tyro/api';
import { PinIcon } from '@tyro/icons';
import cloneDeep from 'lodash/cloneDeep';
import { ReturnTypeFromUseOptionsSolutions } from '../../../api/options-solutions';

interface BlockOrganiserProps {
  blocks: ReturnTypeFromUseOptionsSolutions['pools'][number]['blocks'];
  onChangeBlocks: (updatedBlocks: BlockOrganiserProps['blocks']) => void;
}

export function BlockOrganiser({
  blocks,
  onChangeBlocks,
}: BlockOrganiserProps) {
  const { t } = useTranslation(['subjectOptions']);
  const theme = useTheme();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceBlockIndex = Number(result.source.droppableId);
    const destinationBlockIndex = Number(result.destination.droppableId);

    if (sourceBlockIndex === destinationBlockIndex) {
      return;
    }

    const newBlocks = cloneDeep(blocks);
    const [removed] = newBlocks[sourceBlockIndex].subjectGroups.splice(
      result.source.index,
      1
    );

    newBlocks[destinationBlockIndex].subjectGroups.splice(
      result.destination.index,
      0,
      {
        ...removed,
        blockIdx: destinationBlockIndex,
      }
    );

    onChangeBlocks(newBlocks);
  };

  const toggleItemPin = (blockIndex: number, subjectGroupIndex: number) => {
    const newBlocks = cloneDeep(blocks);
    const currentGroupValue =
      newBlocks[blockIndex].subjectGroups[subjectGroupIndex];

    newBlocks[blockIndex].subjectGroups[subjectGroupIndex] = {
      ...currentGroupValue,
      pinned: !currentGroupValue.pinned,
    };

    onChangeBlocks(newBlocks);
  };

  return (
    <Card variant="outlined">
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, auto)',
            '& > div:nth-of-type(1n + 3)': {
              borderTop: '1px solid',
              borderTopColor: 'indigo.50',
            },
          }}
        >
          {blocks.map(({ blockIdx, subjectGroups }, blockIndex) => {
            const blockColor = getColorBasedOnIndex(blockIdx);
            return (
              <Droppable
                key={blockIdx}
                droppableId={blockIdx.toString()}
                direction="horizontal"
                type="block"
              >
                {(provided, snapshot) => (
                  <>
                    <Box
                      sx={{
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        borderRight: '1px solid',
                        borderRightColor: 'indigo.50',
                      }}
                    >
                      {t('subjectOptions:blockN', { number: blockIdx + 1 })}
                    </Box>
                    <Stack
                      ref={provided.innerRef}
                      direction="row"
                      spacing={1}
                      p={1}
                      {...provided.droppableProps}
                    >
                      {subjectGroups?.map(({ id, name, pinned }, index) => (
                        <Draggable
                          key={id}
                          draggableId={id.toString()}
                          index={index}
                        >
                          {(draggableProvided) => (
                            <Chip
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              variant="soft"
                              label={name}
                              color={blockColor}
                              onDelete={() => toggleItemPin(blockIndex, index)}
                              sx={{
                                '& .MuiChip-deleteIcon': {
                                  transitionProperty: 'width, opacity',
                                  transitionDelay: '0.100s, 0s',
                                  transitionTimingFunction: 'ease-in-out',
                                  transitionDuration: '0.150s',
                                  width: pinned ? 22 : 0,
                                  opacity: pinned ? 1 : 0,
                                  color: pinned
                                    ? `${blockColor}.900`
                                    : undefined,
                                },
                                '&:hover .MuiChip-deleteIcon': {
                                  width: 22,
                                  opacity: 1,
                                  transitionDelay: '0s, 0.100s',
                                },
                              }}
                              deleteIcon={
                                <Box
                                  sx={{
                                    backgroundColor: 'currentColor',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    height: 22,
                                    '& svg': {
                                      color: `${blockColor}.100`,
                                      width: 18,
                                      height: 18,
                                    },
                                    '&:hover': {
                                      '& svg': {
                                        color: `${blockColor}.600`,
                                      },
                                    },
                                  }}
                                >
                                  <PinIcon />
                                </Box>
                              }
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Stack>
                  </>
                )}
              </Droppable>
            );
          })}
        </Box>
      </DragDropContext>
    </Card>
  );
}
