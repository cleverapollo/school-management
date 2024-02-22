import { Card, Chip, Box, Stack, Typography } from '@mui/material';
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
        <Stack
          sx={{
            backgroundColor: 'slate.100',
            pt: 1,
            pb: 4,
            px: 1.25,
          }}
        >
          <Typography
            component="h3"
            variant="subtitle2"
            color="text.secondary"
            pb={0.75}
          >
            {t('subjectOptions:dragNDropToOrganiseGroups')}
          </Typography>
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
                  <Stack
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    direction="row"
                    useFlexGap
                    spacing={1}
                    flexWrap="wrap"
                    sx={{
                      px: 1,
                      py: 1.25,
                      borderTop: '1px dashed',
                      borderTopColor: 'slate.300',
                      borderLeft: '1px dashed transparent',
                      borderRight: '1px dashed transparent',
                      '&:last-of-type': {
                        borderBottom: '1px dashed',
                        borderBottomColor: 'slate.300',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {t('subjectOptions:blockN', { number: blockIdx + 1 })}
                    </Box>
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
                            sx={({ palette }) => ({
                              '& .MuiChip-label': {
                                transition: 'transform 0.150s ease-in-out',
                                transform: `translateX(${pinned ? 0 : 10}px)`,
                              },
                              '& .MuiChip-deleteIcon': {
                                transitionProperty: 'transform, opacity',
                                transitionTimingFunction: 'ease-in-out',
                                transitionDuration: '0.150s',
                                opacity: pinned ? 1 : 0,
                                transform: pinned ? 'scale(1)' : 'scale(0)',
                                color: `${blockColor}.700`,

                                '& path:first-of-type': {
                                  fill: pinned
                                    ? palette[blockColor][700]
                                    : undefined,
                                },

                                '&:hover': {
                                  transform: 'scale(1.25) !important',
                                  color: `${blockColor}.700`,
                                },
                              },
                              '&:hover': {
                                '& .MuiChip-label': {
                                  transform: 'translateX(0px)',
                                },
                                '& .MuiChip-deleteIcon': {
                                  opacity: 1,
                                  transform: 'scale(1)',
                                },
                              },
                            })}
                            deleteIcon={<PinIcon />}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            );
          })}
        </Stack>
      </DragDropContext>
    </Card>
  );
}
