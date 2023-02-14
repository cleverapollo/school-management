import { OutlinedInput } from '@mui/material';
import { SearchIcon } from '@tyro/icons';
import { useSearchProvider } from './provider';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  const { nextOption, previousOption, navigateToSelectedOption } =
    useSearchProvider();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      nextOption();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      previousOption();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      navigateToSelectedOption();
    }
  };

  return (
    <OutlinedInput
      role="combobox"
      autoCorrect="off"
      autoComplete="off"
      autoFocus
      startAdornment={<SearchIcon sx={{ mr: 1 }} />}
      placeholder="Search for students, staff and more..."
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      onKeyDown={handleKeyDown}
      sx={{
        width: '100%',
        '& fieldset': {
          border: 'none',
        },
      }}
    />
  );
}
