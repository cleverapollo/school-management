import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { ICellEditorParams } from '@ag-grid-community/core';
import { Switch } from '@mui/material';

export const TableSwitch = forwardRef(
  (
    { value }: ICellEditorParams<unknown, boolean>,
    ref: ForwardedRef<unknown>
  ) => {
    const inputRef = useRef<HTMLInputElement>();

    useImperativeHandle(ref, () => ({
      getValue() {
        return inputRef.current?.checked;
      },
    }));

    return (
      <Switch
        autoFocus
        defaultChecked={value ?? undefined}
        inputRef={inputRef}
      />
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  TableSwitch.displayName = 'TableSwitch';
}
