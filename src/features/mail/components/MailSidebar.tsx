import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Box, List, Drawer, Button, Divider, Typography, IconButton, DialogTitle, } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// config
import { NAVBAR } from '../../../config';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
//
import MailSidebarItem from './MailSidebarItem';
// @types
import { Mails, MailLabel } from '../types';
import { AddOutlined } from '@mui/icons-material';
import { DialogAnimate } from '../../../components/animate';
import LabelForm from './LabelForm';
import { LabelInput, Maybe } from '@tyro/api';

// ----------------------------------------------------------------------

type Props = {
  isOpenSidebar: boolean;
  onOpenCompose: VoidFunction;
  onCloseSidebar: VoidFunction;
  labels: MailLabel[];
  activeLabelName: string;
  setActiveLabelName: Dispatch<SetStateAction<string>>;
  setMails: Dispatch<SetStateAction<Mails>>;
};

export default function MailSidebar({ isOpenSidebar, onOpenCompose, onCloseSidebar, labels, activeLabelName, setActiveLabelName, setMails }: Props) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'md');

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [labelInfo, setLabelInfo] = useState<Maybe<LabelInput>>(null);

  useEffect(() => {
    if (labelInfo) {
      setIsOpenDialog(true);
    }
  }, [labelInfo]);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenCompose = () => {
    onCloseSidebar();
    onOpenCompose();
  };

  const renderContent = (
    <Scrollbar>
      <Box sx={{ p: 3 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Iconify icon={'eva:plus-fill'} />}
          onClick={handleOpenCompose}
        >
          Compose
        </Button>
      </Box>

      <Divider />

      <List disablePadding>
        {(labels.map((label) =>
          label && 
          label.type !== 'custom' && 
          <MailSidebarItem 
            setActiveLabelName={setActiveLabelName} 
            key={label.id} 
            label={label} 
            isActive={label.name === activeLabelName} 
            setMails={setMails} 
            setLabelInfo={setLabelInfo}
          />
        ))}
      </List>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        color: '#637381', 
        pl: '25px', 
        mt: '10px', 
        pr: '7px'
      }}>
        <Typography variant="body1">Labels</Typography>
        <IconButton onClick={() => setIsOpenDialog(true)}>
          <AddOutlined />
        </IconButton>
      </Box>

      <List disablePadding>
        {(labels.map((label) =>
          label && 
          label.type === 'custom' && 
          <MailSidebarItem 
            setActiveLabelName={setActiveLabelName} 
            key={label.id || label.name} 
            label={label} 
            isActive={label.name === activeLabelName} 
            setMails={setMails} 
            setLabelInfo={setLabelInfo}
          />
        ))}
      </List>

      <DialogAnimate open={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
        <DialogTitle>{labelInfo ? 'Edit label' : 'New label'}</DialogTitle>

        <LabelForm
          onCancel={() => setIsOpenDialog(false)}
          labelInfo={labelInfo}
        />
      </DialogAnimate>
    </Scrollbar>
  );

  return (
    <>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          PaperProps={{ sx: { width: NAVBAR.BASE_WIDTH, position: 'relative' } }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: NAVBAR.BASE_WIDTH } }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}
