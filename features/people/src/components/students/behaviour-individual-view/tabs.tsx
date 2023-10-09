import { useState } from 'react';
import { Tab, Tabs, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import Chip from '@mui/material/Chip';
import { ExtendedNotesTagType } from '../../../pages/students/profile/behaviour';

type TabsPropsType = {
  subCategories?: ExtendedNotesTagType;
};

export const TabsContainer = ({ subCategories }: TabsPropsType) => {
  const { t } = useTranslation(['people']);
  const [value, setValue] = useState(0);

  return (
    <Tabs
      value={value}
      onChange={(_event, newValue: number) => {
        setValue(newValue);
      }}
      variant="scrollable"
      scrollButtons="auto"
      aria-label={t('people:scrollableTabs')}
      TabIndicatorProps={{
        sx: { backgroundColor: 'cyan.100' },
      }}
      sx={{
        '&.MuiTabs-root > .MuiTabs-scrollButtons': { display: 'none' },
        '& .MuiTabs-flexContainer': {
          alignItems: 'center',
          margin: 0,
          borderColor: 'red',
          paddingLeft: 2,
        },
      }}
    >
      {subCategories?.map((item, index) => (
        <Tab
          label={
            <>
              <Chip
                key={index}
                label="7"
                variant="soft"
                sx={{
                  cursor: 'pointer',
                  backgroundColor: `${item?.colour}.100`,
                  borderRadius: '6px',
                  height: '20px',
                  fontWeight: '700',
                  fontSize: '12px',
                  paddingX: '8px',
                  color: `${item?.colour}.500`,
                  '& .MuiChip-icon': {
                    color: `${item?.colour}.500`,
                  },
                  '& .MuiChip-label': {
                    padding: 0,
                  },
                }}
              />
              <Typography
                color="#637381"
                marginLeft={1}
                sx={{
                  fontWeight: '600',
                  fontSize: '14px',
                  textWrap: 'nowrap',
                  textTransform: 'none',
                }}
              >
                {item?.name}
              </Typography>
            </>
          }
        />
      ))}
    </Tabs>
  );
};
