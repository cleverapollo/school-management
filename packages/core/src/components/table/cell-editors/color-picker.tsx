import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ICellEditorParams } from '@ag-grid-community/core';
import { Colour } from '@tyro/api';
import { Box } from '@mui/material';
import { ColorPicker } from '../../color-picker';

export const TableColorPicker = forwardRef(
  (props: ICellEditorParams<unknown, Colour | undefined | null>, ref) => {
    const hasPressedArrowKey = useRef(false);
    const [value, setValue] = useState<Colour | undefined | null>(props.value);
    const [editing, setEditing] = useState(true);
    const refContainer = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      getValue() {
        return value;
      },
    }));

    useEffect(() => {
      if (!editing) {
        props.stopEditing(false);
      }
    }, [editing]);

    useEffect(() => {
      window.setTimeout(() => {
        if (refContainer.current) {
          refContainer.current.focus();
        }
      });
    }, []);

    return (
      <Box p={1}>
        <ColorPicker
          ref={refContainer}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
              hasPressedArrowKey.current = true;
            }
            if (event.key === 'Escape' || event.key === 'Enter') {
              setEditing(false);
            }
          }}
          value={value}
          onChange={(event) => {
            setValue(event.target.value as Colour);
          }}
          onClick={() => {
            if (!hasPressedArrowKey.current) {
              setEditing(false);
            }
            hasPressedArrowKey.current = false;
          }}
        />
      </Box>
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  TableColorPicker.displayName = 'TableColorPicker';
}
