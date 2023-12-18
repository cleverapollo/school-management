import { describe, expect, test } from 'bun:test';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SelectionList } from '../index';

const options = [
  { id: 1, label: 'John Doe', group: 'A' },
  { id: 2, label: 'Jane Doe', group: 'A' },
  { id: 3, label: 'John Smith', group: 'B' },
  { id: 4, label: 'Jane Smith', group: 'B' },
];

describe('SelectionList', () => {
  test('should render a list of options', () => {
    render(<SelectionList value={[]} options={options} />);
    expect(screen.getByText('John Doe')).toBeTruthy();
  });

  test.todo(
    'should render a list of options with a search input if showSearch is true'
  );
  test.todo('should render a list of options grouped by a key');
});
