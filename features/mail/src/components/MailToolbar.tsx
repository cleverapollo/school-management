/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { styled } from '@mui/material/styles';
import {
  Box,
  Tooltip,
  Checkbox,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
// hooks
import { Dispatch, SetStateAction } from 'react';
import { useResponsive } from '@tyro/core';
// components
import { Iconify } from '../../../../src/components/iconify';
import InputStyle from '../../../../src/components/InputStyle';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: 84,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
}));

// ----------------------------------------------------------------------

type Props = {
  mails: number;
  selectedMails: number;
  onOpenSidebar: VoidFunction;
  onToggleDense: VoidFunction;
  onSelectAll: VoidFunction;
  onDeselectAll: VoidFunction;
  filterValue: string;
  setFilterValue: Dispatch<SetStateAction<string>>;
};

export default function MailToolbar({
  mails,
  selectedMails,
  onOpenSidebar,
  onToggleDense,
  onSelectAll,
  onDeselectAll,
  filterValue,
  setFilterValue,
  ...other
}: Props) {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const handleSelectChange = (checked: boolean) =>
    checked ? onSelectAll() : onDeselectAll();

  const selectedAllMails = selectedMails === mails && mails > 0;

  const selectedSomeMails = selectedMails > 0 && selectedMails < mails;

  return (
    <RootStyle {...other}>
      {!mdUp && (
        <IconButton onClick={onOpenSidebar}>
          <Iconify icon="eva:menu-fill" />
        </IconButton>
      )}

      {smUp && (
        <>
          <Checkbox
            checked={selectedAllMails}
            indeterminate={selectedSomeMails}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleSelectChange(event.target.checked)
            }
          />
          <Tooltip title="Refresh">
            <IconButton onClick={() => window.location.reload()}>
              <Iconify icon="eva:refresh-fill" width={20} height={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Dense">
            <IconButton onClick={onToggleDense}>
              <Iconify icon="eva:collapse-fill" width={20} height={20} />
            </IconButton>
          </Tooltip>
        </>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <InputStyle
        stretchStart={180}
        size="small"
        placeholder="Search mail…"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />

      {smUp && (
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
            {/** ToDO: Implement pagination */}1 - {mails} of{' '}
            {mails > 50 ? 50 : mails}
          </Typography>

          <Tooltip title="Next page">
            <IconButton disabled={mails < 50}>
              <Iconify icon="eva:arrow-ios-back-fill" width={20} height={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Previous page">
            <IconButton disabled={mails < 50}>
              <Iconify
                icon="eva:arrow-ios-forward-fill"
                width={20}
                height={20}
              />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </RootStyle>
  );
}
