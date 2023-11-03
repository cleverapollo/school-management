import { Box, Divider, Popover } from '@mui/material';
import { Editor } from '@tiptap/react';
import {
  RoundRedoIcon,
  TextIcon,
  RoundUndoIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  NumberListIcon,
  BulletListIcon,
} from '@tyro/icons';
import {
  getMetaCharacter,
  useDisclosure,
  IconButtonWithTooltip,
} from '@tyro/core';
import { useRef } from 'react';
import { useTranslation } from '@tyro/i18n';
import { StyledToggleButtonGroup } from './toggle-buttons/group';
import { ToggleButton } from './toggle-buttons';

interface MailEditorTextPopoverProps {
  editor: Editor | null;
}

export function MailEditorTextPopover({ editor }: MailEditorTextPopoverProps) {
  const { t } = useTranslation(['mail']);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const metaCharacter = getMetaCharacter();
  const { id, isOpen, onClose, getButtonProps } = useDisclosure();

  return (
    <>
      <IconButtonWithTooltip
        title={t('mail:tooltipTitles.formattingOptions')}
        placement="top"
        ref={buttonRef}
        {...getButtonProps()}
      >
        <TextIcon />
      </IconButtonWithTooltip>
      <Popover
        open={isOpen}
        id={id}
        onClose={onClose}
        anchorEl={buttonRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Box display="flex" flexWrap="wrap">
          <StyledToggleButtonGroup size="small">
            <ToggleButton
              title={t('mail:tooltipTitles.undo', {
                shortcut: `${metaCharacter} + Z`,
              })}
              onClick={() => editor?.chain().undo().run()}
              value="undo"
            >
              <RoundUndoIcon />
            </ToggleButton>
            <ToggleButton
              title={t('mail:tooltipTitles.redo', {
                shortcut: `${metaCharacter} + Y`,
              })}
              onClick={() => editor?.chain().redo().run()}
              value="redo"
            >
              <RoundRedoIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>
          <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
          <StyledToggleButtonGroup>
            <ToggleButton
              title={t('mail:tooltipTitles.bold', {
                shortcut: `${metaCharacter} + B`,
              })}
              onClick={() => editor?.chain().toggleBold().run()}
              selected={editor?.isActive('bold')}
              value="bold"
            >
              <BoldIcon />
            </ToggleButton>
            <ToggleButton
              title={t('mail:tooltipTitles.italic', {
                shortcut: `${metaCharacter} + I`,
              })}
              onClick={() => editor?.chain().toggleItalic().run()}
              selected={editor?.isActive('italic')}
              value="italic"
            >
              <ItalicIcon />
            </ToggleButton>
            <ToggleButton
              title={t('mail:tooltipTitles.underline', {
                shortcut: `${metaCharacter} + U`,
              })}
              onClick={() => editor?.chain().toggleUnderline().run()}
              selected={editor?.isActive('underline')}
              value="underline"
            >
              <UnderlineIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>
          <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
          <StyledToggleButtonGroup>
            <ToggleButton
              title={t('mail:tooltipTitles.numberedList', {
                shortcut: `${metaCharacter} + ⇧ + 7`,
              })}
              onClick={() => editor?.chain().toggleOrderedList().run()}
              selected={editor?.isActive('orderedList')}
              value="orderedList"
            >
              <NumberListIcon />
            </ToggleButton>
            <ToggleButton
              title={t('mail:tooltipTitles.bulletedList', {
                shortcut: `${metaCharacter} + ⇧ + 8`,
              })}
              onClick={() => editor?.chain().toggleBulletList().run()}
              selected={editor?.isActive('bulletList')}
              value="bulletList"
            >
              <BulletListIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Box>
      </Popover>
    </>
  );
}
