import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import chevronDown from '../../assets/header/chevron-down.svg';
import styles from './LanguageMenu.module.css';

export type Language = 'en' | 'ml';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ml', label: 'മലയാളം' },
];

interface Props {
  language: Language;
  onChange: (l: Language) => void;
}

/**
 * Menu button for the portal language. As in the Figma header, the button shows the
 * language you can switch to (മലയാളം while the page is in English).
 */
export function LanguageMenu({ language, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  const current = LANGUAGES.find((l) => l.code === language)!;
  const other = LANGUAGES.find((l) => l.code !== language)!;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    itemRefs.current[LANGUAGES.indexOf(current)]?.focus();
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open, current]);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onMenuKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      items[(i + step + items.length) % items.length]?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Language: ${current.label}. Change language`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span lang={other.code}>{other.label}</span>
        <img src={chevronDown} alt="" width={16} height={16} className={styles.chevron} />
      </button>
      <ul id={menuId} role="menu" className={styles.menu} hidden={!open} onKeyDown={onMenuKey}>
        {LANGUAGES.map((l, i) => (
          <li key={l.code} role="none">
            <button
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={l.code === language}
              lang={l.code}
              className={styles.item}
              onClick={() => {
                onChange(l.code);
                close();
              }}
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
