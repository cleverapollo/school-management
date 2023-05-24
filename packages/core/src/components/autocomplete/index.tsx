import {
  Autocomplete as MiAutocomplete,
  AutocompleteProps as MiAutocompleteProps,
  TextField,
  TextFieldProps,
  Stack,
  Typography,
  Chip,
  ChipProps,
  InputAdornment,
} from '@mui/material';
import React from 'react';
import { getColorBasedOnIndex } from '@tyro/api';
import { Avatar, AvatarProps } from '../avatar';

export type AutocompleteProps<
  T extends object | string,
  FreeSolo extends boolean | undefined = false
> = Omit<
  MiAutocompleteProps<T, boolean, undefined, FreeSolo>,
  'renderInput'
> & {
  label?: TextFieldProps['label'];
  placeholder?: TextFieldProps['placeholder'];
  inputProps?: Omit<TextFieldProps, 'label' | 'placeholder'>;
  optionIdKey?: T extends object ? keyof T : never;
  optionTextKey?: T extends object ? keyof T : never;
  renderAvatarAdornment?: (
    value: T,
    renderAdornment: (avatarProps: AvatarProps) => React.ReactNode
  ) => React.ReactNode;
  renderAvatarOption?: (
    option: T,
    renderOption: (
      avatarProps: AvatarProps & { caption?: string }
    ) => React.ReactNode
  ) => React.ReactNode;
  renderAvatarTags?: (
    tag: T,
    renderTag: (
      avatarProps: AvatarProps,
      chipProps?: ChipProps
    ) => React.ReactNode
  ) => React.ReactNode;
};

export const Autocomplete = <
  T extends object | string,
  FreeSolo extends boolean | undefined = false
>({
  value,
  label,
  placeholder,
  optionIdKey,
  optionTextKey,
  options,
  inputProps,
  renderAvatarAdornment,
  renderAvatarOption,
  renderAvatarTags,
  ...restAutocompleteProps
}: AutocompleteProps<T, FreeSolo>) => (
  <MiAutocomplete
    value={value}
    isOptionEqualToValue={(option, newValue) => {
      if (optionIdKey) {
        return option[optionIdKey] === newValue[optionIdKey];
      }

      return option === newValue;
    }}
    options={options}
    {...(optionTextKey && {
      getOptionLabel: (option) =>
        typeof option === 'string' ? option : (option[optionTextKey] as string),
    })}
    popupIcon={null}
    {...restAutocompleteProps}
    renderInput={(params) => (
      <TextField
        label={label}
        placeholder={placeholder}
        {...params}
        {...inputProps}
        {...(renderAvatarAdornment && {
          InputProps: {
            ...params.InputProps,
            ...inputProps?.InputProps,
            startAdornment: value
              ? renderAvatarAdornment(value as T, (avatarProps) => (
                  <InputAdornment position="start" sx={{ ml: 0.75, mr: 0 }}>
                    <Avatar
                      sx={{ width: 24, height: 24, fontSize: '0.7rem' }}
                      {...avatarProps}
                    />
                  </InputAdornment>
                ))
              : null,
          },
        })}
      />
    )}
    {...(renderAvatarOption && {
      renderOption: (props, option) =>
        renderAvatarOption(option, ({ caption, ...avatarProps }) => (
          <Stack component="li" direction="row" spacing={1} {...props}>
            <Avatar
              sx={{ width: 32, height: 32, fontSize: '0.75rem' }}
              {...avatarProps}
            />
            <Stack>
              <Typography variant="subtitle2">{avatarProps.name}</Typography>
              {caption && <Typography variant="caption">{caption}</Typography>}
            </Stack>
          </Stack>
        )),
    })}
    {...(renderAvatarTags && {
      renderTags: (tags, getTagProps) =>
        tags.map((tag, index) =>
          renderAvatarTags(tag, (avatarProps, chipProps) => (
            <Chip
              size="small"
              variant="soft"
              color={getColorBasedOnIndex(index)}
              avatar={<Avatar {...avatarProps} />}
              label={avatarProps.name}
              {...getTagProps({ index })}
              {...chipProps}
            />
          ))
        ),
    })}
  />
);
