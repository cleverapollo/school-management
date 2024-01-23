import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Portal,
  Divider,
  Backdrop,
  IconButton,
  Typography,
  Link,
} from '@mui/material';
import { useDisclosure, useFormValidator, useResponsive } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { CloseIcon, CollapseIcon, ExpandIcon } from '@tyro/icons';
import { useController, useForm } from 'react-hook-form';
import { RecipientType, usePermissions } from '@tyro/api';
import { Stack } from '@mui/system';
import { useSendMail } from '../../api/mails';
import { ReturnTypeUseMailSearch } from '../../api/mail-search';
import { useMailEditor } from '../../hooks/use-mail-editor';
import { MailEditor } from '../editor';
import { MailEditorToolbar } from '../editor/toolbar';
import { RHFMailSearch } from '../fields/rhf-mail-search';
import { EditorRHFTextfield } from '../fields/rhf-textfield';

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  outline: 'none',
  display: 'flex',
  position: 'fixed',
  overflowX: 'hidden',
  overflowY: 'auto',
  flexDirection: 'column',
  margin: theme.spacing(3),
  boxShadow: theme.customShadows.z20,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.paper,
}));

export interface ComposeMailFormValues {
  subject: string;
  canReply: boolean;
  toRecipients: ReturnTypeUseMailSearch[];
  bccRecipients: ReturnTypeUseMailSearch[];
}

type MailComposeProps = {
  onCloseCompose: () => void;
  defaultValues: Partial<ComposeMailFormValues>;
};

export default function MailCompose({
  onCloseCompose,
  defaultValues,
}: MailComposeProps) {
  const { t } = useTranslation(['mail', 'common']);
  const { isStaffUser } = usePermissions();
  const { isOpen: isBccShowing, onOpen: showBcc } = useDisclosure();
  const isDesktop = useResponsive('up', 'sm');
  const editor = useMailEditor({});
  const { isOpen: isFullScreen, onToggle: onToggleFullScreen } =
    useDisclosure();

  const { resolver, rules } = useFormValidator<ComposeMailFormValues>();

  const { control, handleSubmit, reset } = useForm<ComposeMailFormValues>({
    defaultValues: {
      toRecipients: [],
      bccRecipients: [],
      canReply: true,
      ...defaultValues,
    },
    resolver: resolver({
      subject: rules.required(),
      toRecipients: rules.validate(
        (value: ReturnTypeUseMailSearch[], throwError, formValues) => {
          if (!value.length && !formValues.bccRecipients.length) {
            return throwError(t('mail:errorMessages.recipientsRequired'));
          }
        }
      ),
    }),
  });
  const {
    field: { value: canReplyValue, onChange: onChangeCanReply },
  } = useController({
    name: 'canReply',
    control,
  });

  const { mutateAsync: sendMail, isLoading: isSending } = useSendMail();

  const handleClose = () => {
    onCloseCompose();
  };

  const onSend = handleSubmit(
    ({ toRecipients = [], bccRecipients = [], ...rest }) => {
      const recipients = [
        ...toRecipients.map(({ partyId, type }) => ({
          recipientPartyId: partyId,
          recipientPartyType: type,
          recipientType: RecipientType.To,
        })),
        ...bccRecipients.map(({ partyId, type }) => ({
          recipientPartyId: partyId,
          recipientPartyType: type,
          recipientType: RecipientType.Bcc,
        })),
      ];

      const body = editor?.getHTML() ?? '';

      sendMail({
        ...rest,
        recipients,
        body,
      });
      handleClose();
    }
  );

  useEffect(() => {
    if (defaultValues) {
      if (defaultValues.bccRecipients?.length) {
        showBcc();
      }
      reset(defaultValues);
    }
  }, [defaultValues]);

  return (
    <Portal>
      <Backdrop
        open={isFullScreen || !isDesktop}
        sx={({ zIndex }) => ({ zIndex: zIndex.drawer })}
      />
      <RootStyle
        sx={({ zIndex }) => ({
          zIndex: zIndex.drawer,
          width: {
            xs: `calc(100vw - 24px)`,
            md: `calc(100vw - 80px)`,
          },
          height: {
            xs: `calc(100vh - 24px)`,
            md: `calc(100vh - 80px)`,
          },
          ...(isFullScreen || !isDesktop
            ? {
                top: 0,
                left: 0,
                margin: 'auto',
              }
            : {
                maxHeight: {
                  xs: `min(calc(100vh - 24px), 400px)`,
                  md: `min(calc(100vh - 80px), 400px)`,
                },
                maxWidth: {
                  xs: `min(calc(100vw - 24px), 480px)`,
                  sm: `min(calc(100vw - 80px), 480px)`,
                },
              }),
        })}
      >
        <Stack
          direction="row"
          pl={3}
          pr={1}
          height={60}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography component="h2" variant="h6">
            {t('mail:newMessage')}
          </Typography>
          <Box>
            <IconButton onClick={onToggleFullScreen}>
              {isFullScreen ? (
                <CollapseIcon
                  aria-label={t('mail:actions.collapse')}
                  sx={{ height: 20, width: 20 }}
                />
              ) : (
                <ExpandIcon
                  aria-label={t('mail:actions.expand')}
                  sx={{ height: 20, width: 20 }}
                />
              )}
            </IconButton>

            <IconButton
              aria-label={t('common:actions.close')}
              onClick={handleClose}
            >
              <CloseIcon sx={{ height: 20, width: 20 }} />
            </IconButton>
          </Box>
        </Stack>

        <Divider />

        <RHFMailSearch
          controlProps={{
            control,
            name: 'toRecipients',
          }}
          label={t('mail:placeholders.to')}
          inputProps={{
            InputProps: {
              ...(!isBccShowing && {
                endAdornment: (
                  <Link
                    component="button"
                    sx={{
                      position: 'absolute !important',
                      right: 0,
                    }}
                    onClick={showBcc}
                  >
                    {t('mail:placeholders.bcc')}
                  </Link>
                ),
              }),
            },
          }}
        />

        {isBccShowing && (
          <RHFMailSearch
            controlProps={{
              control,
              name: 'bccRecipients',
            }}
            label={t('mail:placeholders.bcc')}
          />
        )}

        <EditorRHFTextfield
          label={t('mail:placeholders.subject')}
          controlProps={{
            control,
            name: 'subject',
          }}
        />

        <MailEditor editor={editor} />

        <Divider />

        <MailEditorToolbar
          editor={editor}
          onSend={onSend}
          isSending={isSending}
          canReplyValue={canReplyValue}
          onCanReplyChange={isStaffUser ? onChangeCanReply : undefined}
        />
      </RootStyle>
    </Portal>
  );
}
