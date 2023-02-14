import { Box, BoxProps } from '@mui/material';
import { useId, Ref, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchProvider } from './provider';

interface SearchOptionProps extends BoxProps {
  path: string;
  innerLinkSx?: BoxProps['sx'];
}

export function SearchOption({ path, children, ...props }: SearchOptionProps) {
  const id = useId();
  const { focusedOptionId, setFocusedOptionId, addOptionRef, removeOptionRef } =
    useSearchProvider();
  const isFocused = focusedOptionId === id;

  return (
    <Box
      ref={(node: HTMLLIElement | null) => {
        if (node) {
          addOptionRef(id, node);
        } else {
          removeOptionRef(id);
        }
      }}
      component="li"
      role="option"
      aria-selected={isFocused}
      onMouseEnter={() => {
        setFocusedOptionId(id);
      }}
      {...props}
    >
      <Box
        component={Link}
        to={path}
        sx={({ palette }) => ({
          display: 'block',
          px: 1,
          py: 1.5,
          border: `1px solid transparent`,
          borderBottomColor: palette.divider,
          color: 'text.primary',
          textDecoration: 'none',
          '&:not(:last-of-type)': {
            borderBottomColor: palette.divider,
          },
          '[aria-selected="true"] &': {
            backgroundColor: palette.primary.lighter,
            border: `1px solid ${palette.primary.dark}`,
            color: palette.primary.dark,
            borderRadius: 1,
          },
        })}
      >
        {children}
      </Box>
    </Box>
  );
}
