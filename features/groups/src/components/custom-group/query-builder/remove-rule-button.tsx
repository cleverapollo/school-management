import { ActionWithRulesAndAddersProps } from 'react-querybuilder';
import { IconButton, Tooltip } from '@mui/material';
import { TrashIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';

export const RemoveRuleButton = ({
  handleOnClick,
}: ActionWithRulesAndAddersProps) => {
  const { t } = useTranslation(['groups']);

  const label = t('groups:removeRule');

  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        onClick={handleOnClick}
        sx={(theme) => ({
          height: 'fit-content',
          position: 'relative',
          alignSelf: 'stretch',
          '&::before': {
            content: "''",
            borderRight: `1px solid ${theme.palette.slate[200]}`,
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
          },
        })}
      >
        <TrashIcon />
      </IconButton>
    </Tooltip>
  );
};
