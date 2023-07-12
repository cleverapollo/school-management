import {
  PageHeading,
  Page,
  TabPageContainer,
  ActionMenu,
  useDebouncedValue,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useState } from 'react';
import { MaleFemaleIcon, RotationIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { MenuItemConfig } from '@tyro/core/src/components/action-menu/menu-item-list';
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
  const [isCreateRation, setIsCreateRation] = useState(false);
  const { value: selectedBlock, setValue: setSelectedBlock } =
    useDebouncedValue<
      NonNullable<ReturnTypeOfUseBlockList>[number] | undefined
    >({
      defaultValue: undefined,
    });

  const isBlockView = pathname.includes('class-list-manager/blocks') ?? false;
  const [classListSettings, setClassListSettings] = useState({
    showGender: false,
    setCurrentBlock: setSelectedBlock,
  });

  const toggleShowGender = () => {
    setClassListSettings({
      ...classListSettings,
      showGender: !classListSettings.showGender,
    });
  };

  const createRotation = () => {
    setIsCreateRation(true);
  };

  const handleCloseModal = () => {
    setIsCreateRation(false);
  };

  const menuItems = [
    {
      label: classListSettings.showGender
        ? t('classListManager:deactivateGenderView')
        : t('classListManager:activateGenderView'),
      icon: <MaleFemaleIcon />,
      onClick: toggleShowGender,
    },
    isBlockView && {
      label: t('classListManager:createARotation'),
      icon: <RotationIcon />,
      onClick: createRotation,
    },
  ].filter(Boolean) as MenuItemConfig[];

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
            isCreateRation
              ? ({
                  blockId: selectedBlock?.blockId,
                  rotationName: '',
                  iterations: selectedBlock?.rotations?.map((item) => ({
                    startDate: item.startDate
                      ? dayjs(item.startDate)
                      : undefined,
                    endDate: item.endDate ? dayjs(item.endDate) : undefined,
                    iteration: item.iteration,
                  })),
                } as CreateBlockRotationFormState)
              : undefined
          }
          onClose={handleCloseModal}
        />
      </Page>
    </ClassListSettingsProvider>
  );
}
