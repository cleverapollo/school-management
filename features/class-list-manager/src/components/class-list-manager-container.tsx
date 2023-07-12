import {
  PageHeading,
  Page,
  TabPageContainer,
  ActionMenu,
  useDebouncedValue,
  ActionMenuProps,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { MaleFemaleIcon, RotationIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { useContainerMargin } from '../hooks/use-container-margin';
import { ClassListSettingsProvider } from '../store/class-list-settings';
import { ReturnTypeOfUseBlockList } from '../api/blocks';
import {
  CreateBlockRotationFormState,
  CreateBlockRotationModal,
} from './blocks/create-block-rotation-modal';

export default function ClassListManagerContainer() {
  const { t } = useTranslation(['navigation', 'classListManager']);
  const { pathname } = useLocation();
  const containerMargin = useContainerMargin();

  const currenBlockRef = useRef<
    NonNullable<ReturnTypeOfUseBlockList>[number] | undefined
  >(undefined);

  const {
    value: blockForCreateRotation,
    debouncedValue: debouncedBlockForCreateRotation,
    setValue: setBlockForCreateRotation,
  } = useDebouncedValue<CreateBlockRotationFormState | undefined>({
    defaultValue: undefined,
  });

  const isBlockView = pathname.includes('blocks');
  const [classListSettings, setClassListSettings] = useState({
    showGender: false,
    setCurrentBlock: (
      currenBlock?: NonNullable<ReturnTypeOfUseBlockList>[number]
    ) => (currenBlockRef.current = currenBlock),
  });

  const toggleShowGender = () => {
    setClassListSettings({
      ...classListSettings,
      showGender: !classListSettings.showGender,
    });
  };

  const createRotation = () => {
    setBlockForCreateRotation({
      blockId: currenBlockRef?.current?.blockId,
      rotationName: '',
      iterations: currenBlockRef?.current?.rotations?.map((item) => ({
        startDate: item.startDate ? dayjs(item.startDate) : undefined,
        endDate: item.endDate ? dayjs(item.endDate) : undefined,
        iteration: item.iteration,
      })),
    } as CreateBlockRotationFormState);
  };

  const handleCloseModal = () => {
    setBlockForCreateRotation(undefined);
  };

  const menuItems = useMemo<ActionMenuProps['menuItems']>(
    () => [
      {
        label: classListSettings.showGender
          ? t('classListManager:deactivateGenderView')
          : t('classListManager:activateGenderView'),
        icon: <MaleFemaleIcon />,
        onClick: toggleShowGender,
      },
      ...(isBlockView
        ? [
            {
              label: t('classListManager:createARotation'),
              icon: <RotationIcon />,
              onClick: createRotation,
            },
          ]
        : []),
    ],
    [isBlockView]
  );

  return (
    <ClassListSettingsProvider {...classListSettings}>
      <Page title={t('navigation:management.classListManager')} sx={{ px: 0 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <PageHeading
            title={t('navigation:management.classListManager')}
            sx={{ px: containerMargin }}
            rightAdornment={<ActionMenu menuItems={menuItems} />}
          />
          <TabPageContainer
            TabProps={{
              sx: {
                px: containerMargin,
              },
            }}
            links={[
              {
                label: t('classListManager:classes'),
                value: 'classes',
              },
              {
                label: t('classListManager:blocks'),
                value: 'blocks',
              },
            ]}
          />
        </Box>
        <CreateBlockRotationModal
          initialCreateBlockRotationState={
            blockForCreateRotation || debouncedBlockForCreateRotation
          }
          onClose={handleCloseModal}
        />
      </Page>
    </ClassListSettingsProvider>
  );
}
