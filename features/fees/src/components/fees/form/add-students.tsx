import { CardHeader, Grid, Card, Fade, Box, Chip } from '@mui/material';

import {
  Control,
  UseFormGetValues,
  UseFormSetFocus,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';

import { useCallback, useState } from 'react';
import { ListPeoplePagination, StudentSelectOption } from '@tyro/people';
import { useTranslation } from '@tyro/i18n';
import { ActionMenu, RHFAutocomplete } from '@tyro/core';

import { StudentsSearchParty, useStudentsSearchProps } from '@tyro/groups';
import { DiscountIcon } from '@tyro/icons';
import { getColorBasedOnIndex } from '@tyro/api';
import { Stack } from '@mui/system';
import { FeeFormState } from './types';
import { BulkAddIndividualDiscountModal } from './bulk-add-individual-discount-modal';
import { ReturnTypeFromUseDiscounts } from '../../../api/discounts';

type StaticStudentsProps = {
  control: Control<FeeFormState>;
  setFocus: UseFormSetFocus<FeeFormState>;
  setValue: UseFormSetValue<FeeFormState>;
  getValues: UseFormGetValues<FeeFormState>;
};

export const AddStudents = ({
  setValue,
  getValues,
  setFocus,
  control,
}: StaticStudentsProps) => {
  const { t } = useTranslation(['groups', 'common', 'fees']);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<
    StudentSelectOption[]
  >([]);

  const students = useWatch({ control, name: 'students' });

  const studentsGroups = useStudentsSearchProps({
    unshiftMode: true,
    renderAvatarTags: () => null,
  });

  const removeStudent = useCallback(
    (currentPartyId: number) => {
      const currentIndividualDiscounts = getValues('individualDiscounts');

      setValue(
        'students',
        students.filter(({ partyId }) => currentPartyId !== partyId)
      );
      setValue(
        'individualDiscounts',
        currentIndividualDiscounts.filter(
          ({ partyId }) => currentPartyId !== partyId
        )
      );
    },
    [students]
  );

  const handleSaveIndividualDiscount = useCallback(
    ({ id, name }: ReturnTypeFromUseDiscounts) => {
      const currentIndividualDiscounts = getValues('individualDiscounts');
      const updatedIndividualDiscount = selectedStudents.map(({ partyId }) => ({
        id,
        name,
        partyId,
      }));

      const uniqueIndividualDiscounts = [
        ...updatedIndividualDiscount,
        ...currentIndividualDiscounts,
      ].reduce((discountByStudent, discount) => {
        discountByStudent[discount.partyId] ??= discount;

        return discountByStudent;
      }, {} as Record<string, FeeFormState['individualDiscounts'][number]>);

      setValue('individualDiscounts', Object.values(uniqueIndividualDiscounts));
      setIsModalOpen(false);
      setSelectedStudents([]);
    },
    [selectedStudents]
  );

  const handleRemoveIndividualDiscount = useCallback(
    (currentPartyId: number, discountId: number) => {
      const currentIndividualDiscounts = getValues('individualDiscounts');

      setValue(
        'individualDiscounts',
        currentIndividualDiscounts.filter(
          ({ partyId, id }) => currentPartyId !== partyId || id !== discountId
        )
      );
    },
    []
  );

  const handleCancelIndividualDiscount = () => {
    setIsModalOpen(false);
  };

  const individualDiscounts = useWatch({
    control,
    name: 'individualDiscounts',
  });

  return (
    <Card variant="outlined">
      <CardHeader component="h2" title={t('common:students')} />
      <Grid container spacing={2} p={3}>
        <Grid item xs={12}>
          <RHFAutocomplete<FeeFormState, StudentsSearchParty, true>
            {...studentsGroups}
            controlProps={{
              name: 'students',
              control,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ListPeoplePagination
            key={individualDiscounts.length}
            people={students}
            emptyTitle={t('groups:noStaticStudents')}
            emptyDescription={t('groups:noStaticStudentsCta')}
            noFoundMessage={t('groups:noStudentsFound')}
            removeLabel={t('groups:removeStudent')}
            rightAdornment={
              <Fade in={selectedStudents.length > 0}>
                <Box>
                  <ActionMenu
                    menuItems={[
                      {
                        label: t('fees:addDiscount'),
                        icon: <DiscountIcon />,
                        onClick: () => setIsModalOpen(true),
                      },
                    ]}
                  />
                </Box>
              </Fade>
            }
            renderAction={({ partyId }) => (
              <Stack
                direction="row"
                gap={1}
                p={1}
                flexWrap="wrap"
                justifyContent="flex-end"
              >
                {individualDiscounts
                  .filter((discount) => discount.partyId === partyId)
                  .map((tag) => (
                    <Chip
                      key={tag.id}
                      size="small"
                      variant="soft"
                      color={getColorBasedOnIndex(tag.id)}
                      label={tag.name}
                      onDelete={() =>
                        handleRemoveIndividualDiscount(partyId, tag.id)
                      }
                    />
                  ))}
              </Stack>
            )}
            onRowSelection={setSelectedStudents}
            onFocus={() => setFocus('students')}
            onRemove={removeStudent}
          />
        </Grid>
      </Grid>
      <BulkAddIndividualDiscountModal
        isOpen={isModalOpen}
        onSave={handleSaveIndividualDiscount}
        onClose={handleCancelIndividualDiscount}
      />
    </Card>
  );
};
