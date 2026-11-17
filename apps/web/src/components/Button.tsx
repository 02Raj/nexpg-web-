import styles from './button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

type Props = {
  label: string;
  type?: 'button' | 'submit';
  variant?: Variant;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export function Button({
  label,
  type = 'button',
  variant = 'primary',
  disabled,
  onClick,
  className,
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[styles.base, styles[variant], className].filter(Boolean).join(' ')}
    >
      {label}
    </button>
  );
}
