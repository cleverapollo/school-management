import { PopoverOrigin, SxProps, Theme } from '@mui/material';

const options = {
  'top-left': {
    style: { ml: -0.75 },
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
  },
  'top-center': {
    style: {},
    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
    transformOrigin: { vertical: 'top', horizontal: 'center' },
  },
  'top-right': {
    style: { ml: 0.75 },
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    transformOrigin: { vertical: 'top', horizontal: 'right' },
  },
  'bottom-left': {
    style: { ml: -0.75 },
    anchorOrigin: { vertical: 'top', horizontal: 'left' },
    transformOrigin: { vertical: 'bottom', horizontal: 'left' },
  },
  'bottom-center': {
    style: {},
    anchorOrigin: { vertical: 'top', horizontal: 'center' },
    transformOrigin: { vertical: 'bottom', horizontal: 'center' },
  },
  'bottom-right': {
    style: { ml: 0.75 },
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
    transformOrigin: { vertical: 'bottom', horizontal: 'right' },
  },
  'left-top': {
    style: { mt: -0.75 },
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
  },
  'left-center': {
    style: {},
    anchorOrigin: { vertical: 'center', horizontal: 'right' },
    transformOrigin: { vertical: 'center', horizontal: 'left' },
  },
  'left-bottom': {
    style: { mt: 0.75 },
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    transformOrigin: { vertical: 'bottom', horizontal: 'left' },
  },
  'right-top': {
    style: { mt: -0.75 },
    anchorOrigin: { vertical: 'top', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'right' },
  },
  'right-center': {
    style: {},
    anchorOrigin: { vertical: 'center', horizontal: 'left' },
    transformOrigin: { vertical: 'center', horizontal: 'right' },
  },
  'right-bottom': {
    style: { mt: 0.75 },
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'bottom', horizontal: 'right' },
  },
};

type UsePopoverPositionReturn = {
  style: SxProps<Theme>;
  anchorOrigin: PopoverOrigin;
  transformOrigin: PopoverOrigin;
};

export function usePopoverPosition(arrow?: keyof typeof options) {
  return options[arrow ?? 'top-right'] as UsePopoverPositionReturn;
}
