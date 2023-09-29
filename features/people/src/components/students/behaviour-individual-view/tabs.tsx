import { useState } from 'react';
import { Tab, Tabs, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import Chip from '@mui/material/Chip';

const behaviourTabData: Array<{
  colour: string;
  translationText: string;
  total: number;
}> = [
  { colour: 'indigo', translationText: 'All', total: 46 },
  { colour: 'emerald', translationText: 'Uniform violation', total: 12 },
  { colour: 'sky', translationText: 'Incidents', total: 7 },
  { colour: 'pink', translationText: 'Call home', total: 7 },
  { colour: 'red', translationText: 'No homework', total: 1 },
  { colour: 'grey', translationText: 'Fighting', total: 1 },
];

type BehaviorType = {
  filteredTagsNames: string[];
};

export const TabsContainer = ({ filteredTagsNames }: BehaviorType) => {
  const { t } = useTranslation(['people']);
  const [value, setValue] = useState(0);
  const [currentTabValue, setCurrentTabValue] = useState(filteredTagsNames[0]);

  console.log(filteredTagsNames, 'filteredTagsNames');
  console.log(currentTabValue, 'currentTabValue');
  // console.log(academicYear, 'academicYear');

  return (
    <Tabs
      value={value}
      onChange={(_event, newValue: number) => setValue(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      aria-label={t('people:scrollableTabs')}
      TabIndicatorProps={{
        sx: { backgroundColor: `${currentTabValue}` },
      }}
      sx={{
        '& .MuiTabs-flexContainer': {
          alignItems: 'center',
          margin: 0,
          borderColor: 'red',
          paddingLeft: 2,
        },
      }}
    >
      {filteredTagsNames.map((item) => (
        <Tab
          onClick={() => setCurrentTabValue(item)}
          label={
            <>
              <Chip
                key={item}
                label="7"
                variant="soft"
                sx={{
                  cursor: 'pointer',
                  backgroundColor: 'indigo.100',
                  borderRadius: '6px',
                  height: '20px',
                  fontWeight: '700',
                  fontSize: '12px',
                  paddingX: '8px',
                  color: 'indigo.500',
                  '& .MuiChip-icon': {
                    color: `indigo.500`,
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
                {item}
              </Typography>
            </>
          }
        />
      ))}
    </Tabs>
  );
};
