import { useId } from 'react';
import {
  Box,
  BoxProps,
  FilledInput,
  FilledInputProps,
  FormLabel,
} from '@mui/material';
import { SearchIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { VisuallyHidden } from '../visually-hidden';

export interface SearchInputProps extends FilledInputProps {
  containerProps?: BoxProps;
}

export function SearchInput({ containerProps, ...props }: SearchInputProps) {
  const id = useId();
  const { t } = useTranslation(['common']);
  const placeholder = props.placeholder ?? t('common:search');

  return (
    <Box {...containerProps}>
      <VisuallyHidden>
        <FormLabel htmlFor={id}>{placeholder}</FormLabel>
      </VisuallyHidden>
      <FilledInput
        id={id}
        startAdornment={<SearchIcon sx={{ mr: 0.5 }} />}
        hiddenLabel
        size="small"
        fullWidth
        {...props}
        placeholder={placeholder}
      />
    </Box>
  );
}
