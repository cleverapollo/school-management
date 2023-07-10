import { PageHeading, Page, TabPageContainer, ActionMenu } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Box } from '@mui/material';
import { useState } from 'react';
import { MaleFemaleIcon, RatationIcon, PersonHeartIcon } from '@tyro/icons';
import { useContainerMargin } from '../hooks/use-container-margin';
import { ClassListSettingsProvider } from '../store/class-list-settings';
import { ReturnTypeOfUseBlockList } from '../api/blocks';
import { CreateBlockRotationModal } from './blocks/create-block-rotation-modal';

export default function ClassListManagerContainer() {
  const { t } = useTranslation(['navigation', 'classListManager']);
  const containerMargin = useContainerMargin();
  const [isBlockView, setIsBlockView] = useState(false);
  const [isCreateRation, setIsCreateRation] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<
    NonNullable<ReturnTypeOfUseBlockList>[number] | undefined
  >(undefined);

  const [classListSettings, setClassListSettings] = useState({
    showGender: false,
    isBlockView,
    setIsBlockView: (
      value: boolean,
      data?: NonNullable<ReturnTypeOfUseBlockList>[number]
    ) => {
      setIsBlockView(value);
      setSelectedBlock(data);
    },
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
  console.log('selectedBlock', selectedBlock);

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
            rightAdornment={
              <ActionMenu
                menuItems={
                  !isBlockView
                    ? [
                        {
                          label: classListSettings.showGender
                            ? t('classListManager:deactivateGenderView')
                            : t('classListManager:activateGenderView'),
                          icon: <MaleFemaleIcon />,
                          onClick: toggleShowGender,
                        },
                      ]
                    : [
                        {
                          label: 'Create a Rotation',
                          icon: <RatationIcon />,
                          onClick: createRotation,
                        },
                        {
                          label: 'Placeholder action',
                          icon: <PersonHeartIcon />,
                          onClick: () => {},
                        },
                      ]
                }
              />
            }
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
            isCreateRation ? selectedBlock : undefined
          }
          onClose={handleCloseModal}
        />
      </Page>
    </ClassListSettingsProvider>
  );
}
