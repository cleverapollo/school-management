import { Button, Chip, DialogContent } from '@mui/material';
import { Dialog, DialogActions, DialogTitle, Autocomplete } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { getColorBasedOnIndex } from '@tyro/api';
import { useEffect, useState } from 'react';
import { useDiscounts } from '../../../api/discounts';
import { FeeFormState } from './types';

type BulkAddIndividualDiscountModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (discounts: FeeFormState['individualDiscounts']) => void;
};

export function BulkAddIndividualDiscountModal({
  isOpen,
  onClose,
  onSave,
}: BulkAddIndividualDiscountModalProps) {
  const { t } = useTranslation(['common', 'fees']);

  const { data: discountsData = [] } = useDiscounts({});
  const [discounts, setDiscounts] = useState<
    FeeFormState['individualDiscounts']
  >([]);

  const handleSave = () => {
    onSave(discounts);
  };

  useEffect(() => {
    setDiscounts([]);
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{t('fees:addIndividualDiscounts')}</DialogTitle>
      <DialogContent sx={{ pt: 0.75 }}>
        <Autocomplete
          multiple
          value={discounts}
          label={t('fees:discounts')}
          optionIdKey="id"
          optionTextKey="name"
          onChange={(_event, value) => {
            setDiscounts(value as FeeFormState['individualDiscounts']);
          }}
          options={discountsData}
          renderTags={(tags, getTagProps) =>
            tags.map((tag, index) => (
              <Chip
                {...getTagProps({ index })}
                size="small"
                variant="soft"
                color={getColorBasedOnIndex(tag.id)}
                label={tag.name}
              />
            ))
          }
        />
      </DialogContent>
      <DialogActions>
        <Button variant="soft" color="inherit" onClick={onClose}>
          {t('common:actions.cancel')}
        </Button>

        <Button variant="contained" onClick={handleSave}>
          {t('common:actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
