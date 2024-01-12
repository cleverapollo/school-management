import { Button, Chip, DialogContent } from '@mui/material';
import { Dialog, DialogActions, DialogTitle, Autocomplete } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { getColorBasedOnIndex } from '@tyro/api';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  ReturnTypeFromUseDiscounts,
  useDiscounts,
} from '../../../api/discounts';
import { getDiscountName } from '../../../utils/get-discount-name';

type BulkAddIndividualDiscountModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (discount: ReturnTypeFromUseDiscounts) => void;
  isAdd?: boolean;
};

export function BulkAddIndividualDiscountModal({
  isOpen,
  onClose,
  onSave,
  isAdd = true,
}: BulkAddIndividualDiscountModalProps) {
  const { t } = useTranslation(['common', 'fees']);
  const [discount, setDiscount] = useState<ReturnTypeFromUseDiscounts | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const { data: discountsData = [] } = useDiscounts({});
  const nonSiblingDiscounts = discountsData.filter(
    ({ siblingDiscount }) => !siblingDiscount
  );

  const handleSave = async () => {
    if (discount) {
      setLoading(true);
      await (async function () {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await onSave(discount);
      })();
      setLoading(false);
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
      <DialogTitle>
        {t(
          isAdd
            ? 'fees:addIndividualDiscount'
            : 'fees:replaceIndividualDiscount'
        )}
      </DialogTitle>
      <DialogContent sx={{ pt: 0.75 }}>
        <Autocomplete
          value={discount}
          label={t('fees:discounts')}
          optionIdKey="id"
          getOptionLabel={getDiscountName}
          onChange={(_event, value) => {
            setDiscount(value as ReturnTypeFromUseDiscounts);
          }}
          options={nonSiblingDiscounts}
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

        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={handleSave}
          disabled={!discount}
        >
          {t('common:actions.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
