import {
  Box,
  Radio,
  RadioGroup,
  BoxProps,
  RadioGroupProps,
  FormControl,
  FormLabel,
  FormHelperText,
  Tooltip,
} from '@mui/material';
import { ColorOptions, Colour } from '@tyro/api';
import { CheckmarkIcon } from '@tyro/icons';
import { forwardRef, useId } from 'react';
import { useTranslation } from '@tyro/i18n';

export interface ColorPickerProps extends RadioGroupProps {
  colors?: Colour[];
  label?: string;
  error?: boolean;
  helperText?: string;
}

interface IconColorProps extends BoxProps {
  isChecked?: boolean;
}

export function ColorPickerIconColor({
  isChecked,
  sx,
  ...other
}: IconColorProps) {
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        display: 'flex',
        borderRadius: '50%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'currentColor',
        ...(isChecked
          ? {
              transform: 'scale(1.4)',
            }
          : {}),
        transition: (theme) =>
          theme.transitions.create('all', {
            duration: theme.transitions.duration.shortest,
          }),
        '&:before': {
          opacity: 0.48,
          width: '100%',
          content: "''",
          height: '100%',
          borderRadius: '50%',
          position: 'absolute',
          ...(isChecked
            ? {
                boxShadow: '4px 4px 8px 0 currentColor',
              }
            : {}),
        },
        ...sx,
      }}
      {...other}
    >
      <CheckmarkIcon
        sx={{
          color: 'white',
          opacity: isChecked ? 1 : 0,
        }}
      />
    </Box>
  );
}

export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ colors = ColorOptions, id, label, error, helperText, ...props }, ref) => {
    const autoId = useId();
    const pickerId = id ?? autoId;
    const { t } = useTranslation(['common']);

    return (
      <FormControl error={error}>
        {label && <FormLabel id={pickerId}>{label}</FormLabel>}
        <RadioGroup
          row
          aria-labelledby={label ? pickerId : undefined}
          aria-describedby={helperText ? `${pickerId}-helper` : undefined}
          {...props}
        >
          {colors.map((color) => (
            <Tooltip key={color} title={t(`common:colors.${color}`)}>
              <Radio
                inputRef={props.value === color ? ref : undefined}
                value={color}
                color="default"
                icon={<ColorPickerIconColor />}
                checkedIcon={<ColorPickerIconColor isChecked />}
                sx={{
                  color: `${color}.500`,
                  '&:hover': { opacity: 0.72 },
                  '& svg': {
                    width: 12,
                    height: 12,
                    '& path': {
                      strokeWidth: 2,
                    },
                  },
                }}
              />
            </Tooltip>
          ))}
        </RadioGroup>
        {helperText && (
          <FormHelperText id={`${pickerId}-helper`}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  ColorPicker.displayName = 'ColorPicker';
}
