import { ActionWithRulesAndAddersProps } from 'react-querybuilder';
import { Button } from '@mui/material';
import { AddIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';

export const AddRuleButton = ({
  handleOnClick,
}: ActionWithRulesAndAddersProps) => {
  const { t } = useTranslation(['groups']);

  return (
    <Button
      color="primary"
      variant="text"
      startIcon={<AddIcon />}
      onClick={handleOnClick}
    >
      {t('groups:addRule')}
    </Button>
  );
};
