import { Tab, TabProps } from '@mui/material';
import { Link } from 'react-router-dom';

export interface LinkTabProps {
  label: string;
  to: string;
  value: TabProps['value'];
}

export function LinkTab(props: LinkTabProps) {
  return <Tab component={Link} {...props} />;
}
