import { TableLinearProgress, TableLinearProgressProps } from '@tyro/core';

interface StudentRemainingBarProps {
  value: number | undefined;
  total: number | undefined;
}

const defaultRanges: NonNullable<TableLinearProgressProps['ranges']> = [
  {
    min: 0,
    max: 0,
    color: 'slate',
    shade: 300,
  },
  {
    min: 1,
    max: 30,
    color: 'amber',
    shade: 600,
  },
  {
    min: 31,
    max: 100,
    color: 'red',
    shade: 600,
  },
];

export function StudentRemainingBar({
  value,
  total,
}: StudentRemainingBarProps) {
  return (
    <TableLinearProgress value={value} total={total} ranges={defaultRanges} />
  );
}
