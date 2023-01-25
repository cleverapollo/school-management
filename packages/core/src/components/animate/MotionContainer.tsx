import { m, MotionProps } from 'framer-motion';
import { Box, BoxProps } from '@mui/material';
import { varContainer } from './variants';

type Props = BoxProps & MotionProps;

export interface MotionContainerProps extends Props {
  animate?: boolean;
  action?: boolean;
}

export function MotionContainer({
  animate,
  action = false,
  children,
  ...other
}: MotionContainerProps) {
  if (action) {
    return (
      <Box
        component={m.div}
        initial={false}
        animate={animate ? 'animate' : 'exit'}
        variants={varContainer()}
        {...other}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  );
}
