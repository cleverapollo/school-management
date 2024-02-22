import { Box, Link, Stack } from '@mui/material';
import { BubbleMenu, Editor } from '@tiptap/react';
import { IconButtonWithTooltip, useDisclosure } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { LinkIcon } from '@tyro/icons';
import { EditLinkModal } from './edit-modal';

interface InsertLinkButtonProps {
  editor: Editor | null;
}

export function InsertLinkButton({ editor }: InsertLinkButtonProps) {
  const { t } = useTranslation(['common', 'mail']);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentFocusLink = (editor?.getAttributes('link').href ?? '') as string;

  return (
    <>
      <IconButtonWithTooltip
        title={t('mail:tooltipTitles.insertLink')}
        placement="top"
        onClick={onOpen}
      >
        <LinkIcon />
      </IconButtonWithTooltip>
      {editor && (
        <Box
          component={BubbleMenu}
          className="mail-link-popover"
          editor={editor}
          tippyOptions={{ placement: 'bottom', maxWidth: 1000 }}
          updateDelay={0}
          pluginKey="mail-link-popover"
          shouldShow={(props) => props.editor.isActive('link')}
          sx={{
            backgroundColor: 'indigo.100',
            borderRadius: 1,
            py: 0.5,
            fontSize: '0.75rem',
            textWrap: 'nowrap',
            maxWidth: 1000,
            '& a, & button': {
              color: 'indigo.600',
            },
          }}
        >
          <Stack
            mx={1}
            direction="row"
            display="flex"
            alignItems="center"
            spacing={0.5}
          >
            <Stack direction="row" display="inline-flex" spacing={0.25}>
              <span>{t('mail:goToLink')}:</span>
              <Link
                href={currentFocusLink}
                target="_blank"
                rel="noopener noreferrer nofollow"
                sx={{
                  maxWidth: 200,
                  textOverflow: 'ellipsis',
                  display: 'inline-block',
                  overflow: 'hidden',
                }}
              >
                {currentFocusLink}
              </Link>
            </Stack>
            <span>|</span>
            <Box>
              <Link component="button" onClick={onOpen}>
                {t('common:actions.change')}
              </Link>
            </Box>
            <span>|</span>
            <Box>
              <Link
                component="button"
                onClick={() =>
                  editor.chain().extendMarkRange('link').unsetLink().run()
                }
              >
                {t('common:actions.remove')}
              </Link>
            </Box>
          </Stack>
        </Box>
      )}
      <EditLinkModal editor={editor} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
