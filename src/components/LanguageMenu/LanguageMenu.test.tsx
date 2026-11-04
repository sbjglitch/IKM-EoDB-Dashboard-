import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { LanguageMenu, type Language } from './LanguageMenu';

function Harness() {
  const [lang, setLang] = useState<Language>('en');
  return <LanguageMenu language={lang} onChange={setLang} />;
}

describe('LanguageMenu', () => {
  it('shows the other language, opens a menu and switches language', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: /Language: English/ });
    expect(trigger).toHaveTextContent('മലയാളം');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'English' })).toHaveAttribute('aria-checked', 'true');

    await user.click(screen.getByRole('menuitemradio', { name: 'മലയാളം' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    expect(screen.getByRole('button', { name: /Language: മലയാളം/ })).toHaveTextContent('English');
  });

  it('closes on Escape and returns focus', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: /Language/ });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });
});
