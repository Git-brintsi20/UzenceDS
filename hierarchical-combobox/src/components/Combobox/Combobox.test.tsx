/**
 * Integration test for the Combobox component.
 *
 * Verifies the most fundamental interaction: clicking the trigger
 * button opens the dropdown listbox, and clicking again closes it.
 *
 * This test renders the real Combobox with real tree data (no mocks)
 * to confirm end-to-end wiring between useTreeData, useVirtualizer,
 * and the rendered DOM.
 */
/// <reference types="vitest/globals" />
import { render, screen, fireEvent } from '@testing-library/react';
import { Combobox } from './Combobox';

describe('Combobox', () => {
  it('opens the dropdown listbox when the trigger is clicked', () => {
    render(<Combobox />);

    // The trigger button has role="combobox"
    const trigger = screen.getByRole('combobox');

    // Initially the listbox should NOT be in the DOM
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    // Click the trigger to open
    fireEvent.click(trigger);

    // The listbox should now be rendered
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    // Verify that option rows are rendered (root nodes)
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(0);
  });

  it('closes the dropdown when the trigger is clicked a second time', () => {
    render(<Combobox />);

    const trigger = screen.getByRole('combobox');

    // Open
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeTruthy();

    // Close
    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
