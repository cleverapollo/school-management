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
  useTheme,
} from '@mui/material';
import React, { ForwardedRef, Fragment } from 'react';
import { useTranslation } from '@tyro/i18n';
import { Avatar, AvatarProps } from '../avatar';
import { getBaseColorBasedOnString } from '../../utils';

type TextfieldCustomProps = Omit<
  TextFieldProps,
  'label' | 'placeholder' | 'variant'
> & {
  variant?: TextFieldProps['variant'] | 'white-filled';
};

export type AutocompleteProps<
  T extends object | string,
  FreeSolo extends boolean | undefined = false
> = Omit<MiAutocompleteProps<T, boolean, boolean, FreeSolo>, 'renderInput'> & {
  label?: TextFieldProps['label'];
  placeholder?: TextFieldProps['placeholder'];
  inputProps?: TextfieldCustomProps;
  optionIdKey?: keyof T;
  optionTextKey?: T extends object ? keyof T : never;
  customRef?: ForwardedRef<unknown>;
  unshiftMode?: boolean;
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
  unshiftMode,
  customRef,
  multiple,
  ...restAutocompleteProps
}: AutocompleteProps<T, FreeSolo>) => {
  const { spacing, palette } = useTheme();
  const { t } = useTranslation(['common']);

  const { variant } = inputProps ?? {};
  const isWhiteFilledVariant = variant === 'white-filled';

  return (
    <MiAutocomplete
      ref={customRef}
      value={value}
      isOptionEqualToValue={(option, newValue) => {
        if (optionIdKey) {
          return option[optionIdKey] === newValue[optionIdKey];
        }

        return JSON.stringify(option) === JSON.stringify(newValue);
      }}
      loadingText={t('common:loading')}
      multiple={multiple}
      options={options}
      {...(optionTextKey && {
        getOptionLabel: (option) =>
          typeof option === 'string'
            ? option
            : (option[optionTextKey] as string),
      })}
      popupIcon={null}
      {...restAutocompleteProps}
      {...(unshiftMode &&
        multiple && {
          onChange: (event, newValue, ...restParams) => {
            if (Array.isArray(newValue)) {
              const lastItem = newValue.at(newValue.length - 1) as T;
              newValue.pop();
              restAutocompleteProps.onChange?.(
                event,
                [lastItem, ...newValue],
                ...restParams
              );
            } else {
              restAutocompleteProps.onChange?.(event, newValue, ...restParams);
            }
          },
        })}
      renderInput={(params) => (
        <TextField
          label={label}
          placeholder={placeholder}
          {...params}
          {...inputProps}
          InputProps={{
            ...params.InputProps,
            ...inputProps?.InputProps,
          }}
          variant={isWhiteFilledVariant ? 'filled' : variant}
          {...(renderAvatarAdornment && {
            InputProps: {
              ...params.InputProps,
              ...inputProps?.InputProps,
              ...(!multiple &&
                value && {
                  startAdornment: renderAvatarAdornment(
                    value as T,
                    (avatarProps) => (
                      <InputAdornment position="start" sx={{ ml: 0.75, mr: 0 }}>
                        <Avatar
                          sx={{ width: 24, height: 24, fontSize: '0.625rem' }}
                          {...avatarProps}
                        />
                      </InputAdornment>
                    )
                  ),
                }),
            },
          })}
          sx={{
            ...inputProps?.sx,
            ...(isWhiteFilledVariant && {
              '& .MuiInputBase-root, & .MuiInputBase-root.Mui-focused': {
                backgroundColor: palette.background.default,
                borderRadius: spacing(1),
              },
              '& .MuiInputBase-root:hover': {
                backgroundColor: palette.primary.lighter,
              },
            }),
          }}
        />
      )}
      {...(renderAvatarOption && {
        renderOption: (props, option) => (
          <Fragment key={String(optionIdKey ? option[optionIdKey] : option)}>
            {renderAvatarOption(option, ({ caption, ...avatarProps }) => (
              <Stack component="li" direction="row" spacing={1} {...props}>
                <Avatar
                  sx={{ width: 32, height: 32, fontSize: '0.75rem' }}
                  {...avatarProps}
                />
                <Stack>
                  <Typography variant="subtitle2">
                    {avatarProps.name}
                  </Typography>
                  {caption && (
                    <Typography variant="caption">{caption}</Typography>
                  )}
                </Stack>
              </Stack>
            ))}
          </Fragment>
        ),
      })}
      {...(renderAvatarTags && {
        renderTags: (tags, getTagProps) =>
          tags.map((tag, index) =>
            renderAvatarTags(tag, (avatarProps, chipProps) => (
              <Chip
                size="small"
                variant="soft"
                color={getBaseColorBasedOnString(avatarProps.name ?? '')}
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
