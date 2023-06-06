/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import {
  Box,
  List,
  Drawer,
  Button,
  Divider,
  Typography,
  IconButton,
  DialogTitle,
} from '@mui/material';
// hooks
import { Scrollbar, useResponsive } from '@tyro/core';
import { AddOutlined } from '@mui/icons-material';
import { LabelInput, Maybe } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
//
import { AddIcon } from '@tyro/icons';
import MailSidebarItem from './MailSidebarItem';
// @types
import { Mails, MailLabel } from '../types';
import { DialogAnimate } from '../../../../src/components/animate';
import LabelForm from './LabelForm';

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

export default function MailSidebar({
  isOpenSidebar,
  onOpenCompose,
  onCloseSidebar,
  labels,
  activeLabelName,
  setActiveLabelName,
  setMails,
}: Props) {
  const { pathname } = useLocation();
  const { t } = useTranslation(['mail', 'common']);

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
          startIcon={<AddIcon />}
          onClick={handleOpenCompose}
        >
          {t('common:actions.compose')}
        </Button>
      </Box>

      <Divider />

      <List disablePadding>
        {labels.map(
          (label) =>
            label &&
            label.type !== 'custom' && (
              <MailSidebarItem
                setActiveLabelName={setActiveLabelName}
                key={label.id}
                label={label}
                isActive={label.name === activeLabelName}
                setMails={setMails}
                setLabelInfo={setLabelInfo}
              />
            )
        )}
      </List>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#637381',
          pl: '25px',
          mt: '10px',
          pr: '7px',
        }}
      >
        <Typography variant="body1">{t('mail:labels')}</Typography>
        <IconButton onClick={() => setIsOpenDialog(true)}>
          <AddOutlined />
        </IconButton>
      </Box>

      <List disablePadding>
        {labels.map(
          (label) =>
            label &&
            label.type === 'custom' && (
              <MailSidebarItem
                setActiveLabelName={setActiveLabelName}
                key={label.id || label.name}
                label={label}
                isActive={label.name === activeLabelName}
                setMails={setMails}
                setLabelInfo={setLabelInfo}
              />
            )
        )}
      </List>

      <DialogAnimate open={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
        <DialogTitle>
          {labelInfo ? t('mail:editLabel') : t('mail:newLabel')}
        </DialogTitle>

        <LabelForm
          onCancel={() => setIsOpenDialog(false)}
          labelInfo={labelInfo}
        />
      </DialogAnimate>
    </Scrollbar>
  );

  return isDesktop ? (
    <Drawer
      variant="permanent"
      PaperProps={{ sx: { width: 260, position: 'relative' } }}
    >
      {renderContent}
    </Drawer>
  ) : (
    <Drawer
      open={isOpenSidebar}
      onClose={onCloseSidebar}
      ModalProps={{ keepMounted: true }}
      PaperProps={{ sx: { width: 260 } }}
    >
      {renderContent}
    </Drawer>
  );
}
