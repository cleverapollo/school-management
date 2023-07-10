import { styled, Typography } from '@mui/material';

export const ListHeader = styled(Typography)(
  ({ theme }) => `
  padding: ${theme.spacing(0, 3, 1)};
  border-bottom: 1px solid ${theme.palette.divider};
  position: sticky;
  top: 0;
  background-color: ${theme.palette.background.paper};
  z-index: 1;
`
) as typeof Typography;
