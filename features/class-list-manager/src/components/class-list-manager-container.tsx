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
import { useMemo, useState } from 'react';
import { MaleFemaleIcon, RotationIcon } from '@tyro/icons';
import { useContainerMargin } from '../hooks/use-container-margin';
import { ClassListSettingsProvider } from '../store/class-list-settings';
import { ReturnTypeOfUseBlockList } from '../api/blocks';
import { CreateBlockRotationModal } from './blocks/create-block-rotation-modal';

export default function ClassListManagerContainer() {
  const { t } = useTranslation(['navigation', 'classListManager']);
  const { pathname } = useLocation();
  const containerMargin = useContainerMargin();

  const [currentBlock, setCurrentBlock] =
    useState<NonNullable<ReturnTypeOfUseBlockList>[number]>();
  const blockHasRotations = !!currentBlock?.isRotation;

  const {
    value: blockForCreateRotation,
    debouncedValue: debouncedBlockForCreateRotation,
    setValue: setBlockForCreateRotation,
  } = useDebouncedValue<
    NonNullable<ReturnTypeOfUseBlockList>[number] | undefined
  >({
    defaultValue: undefined,
  });

  const isBlockView = pathname.includes('blocks');
  const [classListSettings, setClassListSettings] = useState({
    showGender: false,
    setCurrentBlock,
  });

  const toggleShowGender = () => {
    setClassListSettings((prevState) => ({
      ...prevState,
      showGender: !prevState.showGender,
    }));
  };

  const createRotation = () => {
    setBlockForCreateRotation(currentBlock);
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
      ...(isBlockView && !blockHasRotations
        ? [
            {
              label: blockHasRotations
                ? t('classListManager:updateRotation')
                : t('classListManager:createRotation'),
              icon: <RotationIcon />,
              onClick: createRotation,
            },
          ]
        : []),
    ],
    [isBlockView, blockHasRotations, classListSettings, t, currentBlock]
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
          open={blockForCreateRotation}
          blockForCreateRotation={
            blockForCreateRotation || debouncedBlockForCreateRotation
          }
          onClose={() => setBlockForCreateRotation(undefined)}
        />
      </Page>
    </ClassListSettingsProvider>
  );
}
