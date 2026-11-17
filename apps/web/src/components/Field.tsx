import styles from './field.module.css';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
};

export function Field({ label, value, onChange, type = 'text', placeholder, hint, maxLength }: Props) {
  return (
    <label className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      <input
        className={styles.input}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  );
}
