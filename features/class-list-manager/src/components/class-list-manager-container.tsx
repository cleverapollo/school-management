import { PageHeading, Page, TabPageContainer, ActionMenu } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Box } from '@mui/material';
import { useState } from 'react';
import { MaleFemaleIcon } from '@tyro/icons';
import { useContainerMargin } from '../hooks/use-container-margin';
import { ClassListSettingsProvider } from '../store/class-list-settings';

export default function ClassListManagerContainer() {
  const { t } = useTranslation(['navigation', 'classListManager']);
  const containerMargin = useContainerMargin();
  const [classListSettings, setClassListSettings] = useState({
    showGender: false,
  });

  const toggleShowGender = () => {
    setClassListSettings({
      ...classListSettings,
      showGender: !classListSettings.showGender,
    });
  };

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
                menuItems={[
                  {
                    label: classListSettings.showGender
                      ? t('classListManager:deactivateGenderView')
                      : t('classListManager:activateGenderView'),
                    icon: <MaleFemaleIcon />,
                    onClick: toggleShowGender,
                  },
                ]}
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
      </Page>
    </ClassListSettingsProvider>
  );
}
