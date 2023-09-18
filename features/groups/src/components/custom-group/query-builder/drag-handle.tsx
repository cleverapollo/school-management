import { forwardRef } from 'react';
import { DragIndicatorIcon } from '@tyro/icons';
import { Stack } from '@mui/material';

export const DragHandle = forwardRef<HTMLSpanElement>((_props, ref) => (
  <Stack
    component="span"
    draggable
    ref={ref}
    flexDirection="row"
    alignItems="center"
    position="relative"
    alignSelf="stretch"
    sx={(theme) => ({
      height: theme.spacing(5),
      '&::after': {
        content: "''",
        borderRight: `1px solid ${theme.palette.slate[200]}`,
        position: 'absolute',
        right: '-0.25rem',
        top: 0,
        bottom: 0,
      },
    })}
  >
    <DragIndicatorIcon color="disabled" />
  </Stack>
));

if (process.env.NODE_ENV !== 'production') {
  DragHandle.displayName = 'DragHandle';
}
