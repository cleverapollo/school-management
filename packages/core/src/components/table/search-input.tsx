import { Box, FilledInput, FilledInputProps, FormLabel } from '@mui/material';
import { SearchIcon } from '@tyro/icons';
import { VisuallyHidden } from '../visually-hidden';

export function TableSearchInput(props: FilledInputProps) {
  return (
    <Box>
      <VisuallyHidden>
        <FormLabel>Search</FormLabel>
      </VisuallyHidden>
      <FilledInput
        startAdornment={<SearchIcon sx={{ mr: 0.5 }} />}
        hiddenLabel
        placeholder="Search"
        size="small"
        {...props}
      />
    </Box>
  );
}
