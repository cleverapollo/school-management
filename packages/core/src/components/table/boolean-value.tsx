import { Box, BoxProps, SvgIconProps } from '@mui/material';
import { CheckmarkCircleBigIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';

export interface TableBooleanValueProps {
  value: boolean;
  'aria-label'?: string;
  trueProps?: SvgIconProps;
  falseProps?: BoxProps;
}

export function TableBooleanValue({
  value,
  'aria-label': ariaLabel,
  trueProps = {},
  falseProps = {},
}: TableBooleanValueProps) {
  const [t] = useTranslation(['common']);

  return value ? (
    <CheckmarkCircleBigIcon
      aria-label={ariaLabel ?? t('common:yes')}
      sx={{ color: 'emerald.500' }}
      {...trueProps}
    />
  ) : (
    <Box
      aria-label={ariaLabel ?? t('common:no')}
      component="span"
      color="slate.300"
      {...falseProps}
    >
      -
    </Box>
  );
}
