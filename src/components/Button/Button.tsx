import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type CommonProps = {
  size?: 'sm' | 'xl';
  hierarchy?: 'primary' | 'tertiary' | 'tertiary-grey';
  /** Where the icon sits. 'only' renders just the icon (give it an aria-label). */
  icon?: 'none' | 'leading' | 'trailing' | 'only';
  iconNode?: ReactNode;
  children?: ReactNode;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** K-Suite Button. Renders an <a> when `href` is given, otherwise a <button>. */
export function Button(props: ButtonProps | LinkProps) {
  const {
    size = 'sm',
    hierarchy = 'primary',
    icon = 'none',
    iconNode,
    children,
    className,
    ...rest
  } = props;
  const cls = [styles.button, styles[size], styles[hierarchy.replace('-', '_')], className]
    .filter(Boolean)
    .join(' ');
  const content = (
    <>
      {icon === 'leading' && iconNode}
      {icon === 'only' ? iconNode : children}
      {icon === 'trailing' && iconNode}
    </>
  );
  if ('href' in props && props.href !== undefined) {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
