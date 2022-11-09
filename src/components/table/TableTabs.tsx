import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { SyntheticEvent, FC } from 'react';

interface ITableTabsProps {
  tabs?: string[];
  onChangeTab?: (event: SyntheticEvent, newValue: string) => void;
  tabValue?: string;
}

const TableTabs: FC<ITableTabsProps> = ({ tabs, onChangeTab, tabValue }) => (
  <Box sx={{ width: '100%', typography: 'body1', padding: '5px 10px 0', background: '#F4F6F8' }}>
    <TabContext value={tabValue || '0'}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList 
          onChange={onChangeTab} 
          aria-label="tab-list" 
          TabIndicatorProps={{ style: { background: '#00AB55' }}}
        >
          {tabs?.map((label, index) => <Tab key={label + index} label={label} value={index.toString()} />)}
        </TabList>
      </Box>
    </TabContext>
  </Box>
);

export default TableTabs;
