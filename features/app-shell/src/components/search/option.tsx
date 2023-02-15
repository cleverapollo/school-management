import { Box, BoxProps } from '@mui/material';
import { useId } from 'react';
import { Link } from 'react-router-dom';
import { SearchOptionData, useSearchProvider } from './provider';

interface SearchOptionProps extends BoxProps {
  path: string;
  optionData: SearchOptionData;
  innerLinkSx?: BoxProps['sx'];
}

export function SearchOption({
  path,
  children,
  optionData,
  ...props
}: SearchOptionProps) {
  const id = useId();
  const {
    focusedOptionId,
    setFocusedOptionId,
    addOptionRef,
    removeOptionRef,
    navigateToSelectedOption,
  } = useSearchProvider();
  const isFocused = focusedOptionId === id;

  return (
    <Box
      ref={(node: HTMLLIElement | null) => {
        if (node) {
          addOptionRef(id, {
            node,
            data: optionData,
          });
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
        onClick={(event) => {
          event.preventDefault();
          navigateToSelectedOption();
        }}
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
