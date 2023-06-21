import { styled, Table } from '@mui/material';
import { pxToRem } from '@tyro/core';

export const SwapStyledTable = styled(Table)(({ theme: { palette } }) => ({
  th: {
    backgroundImage: 'none',
    borderBottom: `1px solid ${palette.divider}`,
  },

  '& button': {
    textWrap: 'nowrap',
  },

  '& .day-initial': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: pxToRem(12),
    fontWeight: 600,
    borderRadius: '50%',
    textTransform: 'uppercase',
    color: palette.primary.main,
    backgroundColor: palette.primary.lighter,
    width: 20,
    height: 20,
  },

  '& .resource-start-time': {
    fontSize: pxToRem(14),
    fontWeight: 600,
    color: palette.primary.main,
  },
}));
