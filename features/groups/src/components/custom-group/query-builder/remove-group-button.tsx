import { ActionWithRulesAndAddersProps } from 'react-querybuilder';
import { IconButton, Tooltip } from '@mui/material';
import { RemoveListIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';

export const RemoveGroupButton = ({
  handleOnClick,
}: ActionWithRulesAndAddersProps) => {
  const { t } = useTranslation(['groups']);

  const label = t('groups:removeGroup');

  return (
    <Tooltip title={label}>
      <IconButton aria-label={label} onClick={handleOnClick}>
        <RemoveListIcon />
      </IconButton>
    </Tooltip>
  );
};
