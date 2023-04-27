import {
  Autocomplete as MiAutocomplete,
  AutocompleteProps as MiAutocompleteProps,
  TextField,
  TextFieldProps,
  Stack,
  Typography,
  Chip,
  ChipProps,
} from '@mui/material';
import React, { useMemo } from 'react';
import { getColorBasedOnIndex } from '@tyro/api';
import { Avatar, AvatarProps } from '../avatar';

export type AutocompleteProps<T extends object | string> = Omit<
  MiAutocompleteProps<
    T,
    boolean,
    undefined,
    T extends string ? boolean : undefined
  >,
  'renderInput'
> & {
  label?: TextFieldProps['label'];
  placeholder?: TextFieldProps['placeholder'];
  inputProps?: Omit<TextFieldProps, 'label' | 'placeholder'>;
  optionIdKey?: T extends object ? keyof T : never;
  optionTextKey?: T extends object ? keyof T : never;
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

export const Autocomplete = <T extends object | string>({
  value,
  label,
  placeholder,
  optionIdKey,
  optionTextKey,
  options,
  inputProps,
  renderAvatarOption,
  renderAvatarTags,
  ...restAutocompleteProps
}: AutocompleteProps<T>) => {
  const selectedOption = useMemo<T | T[] | undefined>(() => {
    if (!value) return undefined;

    // for multiple selection
    if (restAutocompleteProps.multiple && Array.isArray(value)) {
      const valueAsArray = value as T[];

      return options.filter((option) => {
        // for enums
        if (typeof option === 'string') {
          return valueAsArray.includes(option);
        }

        if (optionIdKey) {
          // for objects
          return valueAsArray
            .map((v) => v[optionIdKey])
            .includes(option[optionIdKey]);
        }

        return undefined;
      });
    }

    // for one selection
    const valueAsObject = value as T;

    return options.find((option) => {
      // for enums
      if (typeof option === 'string') {
        return option === value;
      }

      // for objects
      if (optionIdKey) {
        return option[optionIdKey] === valueAsObject[optionIdKey];
      }

      return undefined;
    });
  }, [value, options]);

  return (
    <MiAutocomplete
      value={selectedOption}
      isOptionEqualToValue={(option, newValue) => {
        if (optionIdKey) {
          return option[optionIdKey] === newValue[optionIdKey];
        }

        return option === newValue;
      }}
      options={options}
      {...(optionTextKey && {
        getOptionLabel: (option) =>
          typeof option === 'string'
            ? option
            : (option[optionTextKey] as string),
      })}
      popupIcon={null}
      {...restAutocompleteProps}
      renderInput={(params) => (
        <TextField
          {...params}
          {...inputProps}
          label={label}
          placeholder={placeholder}
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
                {caption && (
                  <Typography variant="caption">{caption}</Typography>
                )}
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
};
