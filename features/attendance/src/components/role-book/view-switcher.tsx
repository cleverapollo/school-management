import { Stack, ToggleButton, Tooltip } from '@mui/material';

import { HashtagSquareIcon, ShapeObjectsSquareIcon } from '@tyro/icons';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';

const getViewOptions = (t: TFunction<'attendance'[]>) =>
  [
    {
      value: 'icons',
      label: t('attendance:iconView'),
      icon: ShapeObjectsSquareIcon,
    },
    {
      value: 'codes',
      label: t('attendance:codeView'),
      icon: HashtagSquareIcon,
    },
  ] as const;

export type ViewOption = ReturnType<typeof getViewOptions>[number];

interface ViewToggleButtonProps {
  value: ViewOption['value'];
  label: ViewOption['label'];
  icon: ViewOption['icon'];
  selected: boolean;
  onChange: (value: ViewOption['value']) => void;
}

function ViewToggleButton({
  value,
  label,
  icon: Icon,
  selected,
  onChange,
}: ViewToggleButtonProps) {
  return (
    <Tooltip title={label}>
      <ToggleButton
        value={value}
        selected={selected}
        onChange={() => onChange(value)}
        sx={{ width: 32, height: 32, padding: 0, border: 0 }}
      >
        <Icon sx={{ width: 20, height: 20 }} />
      </ToggleButton>
    </Tooltip>
  );
}

interface RolebookViewSwitcherProps {
  value: ViewOption['value'];
  onChange: (value: ViewOption['value']) => void;
}

export function RolebookViewSwitcher({
  value,
  onChange,
}: RolebookViewSwitcherProps) {
  const { t } = useTranslation(['attendance']);
  const viewOptions = useMemo(() => getViewOptions(t), [t]);

  return (
    <Stack
      role="group"
      aria-label={t('attendance:changeRolebookView')}
      direction="row"
      spacing={1}
      sx={{
        button: {
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: 'slate.100',
          color: 'slate.500',

          '&.Mui-selected': {
            borderColor: 'indigo.200',
            color: 'primary.main',
            backgroundColor: 'indigo.50',

            '&:hover': {
              backgroundColor: 'indigo.100',
            },
          },
        },
      }}
    >
      {viewOptions.map((props) => (
        <ViewToggleButton
          key={props.value}
          {...props}
          selected={props.value === value}
          onChange={onChange}
        />
      ))}
    </Stack>
  );
}
