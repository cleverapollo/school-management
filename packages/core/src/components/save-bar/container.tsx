import {
  Box,
  BoxProps,
  Slide,
  useTheme,
  SlideProps,
  StackProps,
  Stack,
} from '@mui/material';
import { PropsWithChildren } from 'react';

type SaveBarContainerProps = PropsWithChildren<{
  slideProps?: Partial<SlideProps>;
  containerProps?: Partial<BoxProps>;
  contentProps?: Partial<StackProps>;
}>;

export const SaveBarContainer = ({
  children,
  containerProps,
  contentProps,
  slideProps,
}: SaveBarContainerProps) => {
  const { zIndex } = useTheme();

  return (
    <Slide direction="up" mountOnEnter unmountOnExit {...slideProps}>
      <Box
        className="bulk-edit-save-bar"
        position="fixed"
        bottom={0}
        left={0}
        display="flex"
        bgcolor="slate.100"
        width="100%"
        py={1.25}
        px={2.25}
        zIndex={zIndex.drawer + 1}
        boxShadow="0px -1px 10px rgba(99, 102, 241, 0.20)"
        {...containerProps}
        sx={{
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          borderTop: '1px solid',
          borderTopColor: 'indigo.50',
          ...containerProps?.sx,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          bgcolor="background.paper"
          border="1px solid"
          borderColor="indigo.50"
          borderRadius={1.5}
          {...contentProps}
        >
          {children}
        </Stack>
      </Box>
    </Slide>
  );
};
