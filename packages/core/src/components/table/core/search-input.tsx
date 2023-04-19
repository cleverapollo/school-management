import { useId } from 'react';
import { Box, FilledInput, FilledInputProps, FormLabel } from '@mui/material';
import { SearchIcon } from '@tyro/icons';
import { VisuallyHidden } from '../../visually-hidden';

export function TableSearchInput(props: FilledInputProps) {
  const id = useId();

  return (
    <Box>
      <VisuallyHidden>
        <FormLabel htmlFor={id}>Search</FormLabel>
      </VisuallyHidden>
      <FilledInput
        id={id}
        startAdornment={<SearchIcon sx={{ mr: 0.5 }} />}
        hiddenLabel
        placeholder="Search"
        size="small"
        {...props}
      />
    </Box>
  );
}
