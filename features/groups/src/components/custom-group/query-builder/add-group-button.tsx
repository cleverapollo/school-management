import { ActionWithRulesAndAddersProps } from 'react-querybuilder';
import { Button } from '@mui/material';
import { AddCircleIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';

export const AddGroupButton = ({
  handleOnClick,
}: ActionWithRulesAndAddersProps) => {
  const { t } = useTranslation(['groups']);

  return (
    <Button
      color="primary"
      variant="soft"
      startIcon={<AddCircleIcon />}
      onClick={handleOnClick}
    >
      {t('groups:addGroup')}
    </Button>
  );
};
