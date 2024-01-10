import { Button, Chip, DialogContent } from '@mui/material';
import { Dialog, DialogActions, DialogTitle, Autocomplete } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { getColorBasedOnIndex } from '@tyro/api';
import { useEffect, useState } from 'react';
import {
  ReturnTypeFromUseDiscounts,
  useDiscounts,
} from '../../../api/discounts';

type BulkAddIndividualDiscountModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (discount: ReturnTypeFromUseDiscounts) => void;
};

export function BulkAddIndividualDiscountModal({
  isOpen,
  onClose,
  onSave,
}: BulkAddIndividualDiscountModalProps) {
  const { t } = useTranslation(['common', 'fees']);

  const { data: discountsData = [] } = useDiscounts({});
  const [discount, setDiscount] = useState<ReturnTypeFromUseDiscounts | null>(
    null
  );

  const handleSave = () => {
    if (discount) {
      onSave(discount);
    }
  };

  useEffect(() => {
    setDiscount(null);
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{t('fees:addIndividualDiscount')}</DialogTitle>
      <DialogContent sx={{ pt: 0.75 }}>
        <Autocomplete
          value={discount}
          label={t('fees:discounts')}
          optionIdKey="id"
          optionTextKey="name"
          onChange={(_event, value) => {
            setDiscount(value as ReturnTypeFromUseDiscounts);
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
