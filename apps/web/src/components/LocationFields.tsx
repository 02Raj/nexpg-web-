import { CITY_STATE_HINT, INDIAN_STATES, POPULAR_PG_CITIES } from '@/lib/locations';
import { Field } from '@/components/Field';
import styles from './location-fields.module.css';

type Props = {
  state: string;
  city: string;
  address: string;
  onStateChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onAddressChange: (v: string) => void;
};

export function LocationFields({
  state,
  city,
  address,
  onStateChange,
  onCityChange,
  onAddressChange,
}: Props) {
  const pickCity = (name: string) => {
    onCityChange(name);
    const hint = CITY_STATE_HINT[name];
    if (hint) onStateChange(hint);
  };

  return (
    <div className={styles.wrap}>
      <label className={styles.block}>
        <span className={styles.label}>State / UT</span>
        <select className={styles.select} value={state} onChange={(e) => onStateChange(e.target.value)}>
          <option value="">Select state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <div className={styles.block}>
        <span className={styles.label}>City</span>
        <p className={styles.hint}>Popular IT hubs — or type your own below.</p>
        <div className={styles.chips}>
          {POPULAR_PG_CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => pickCity(c)}
              className={[styles.chip, city === c ? styles.chipOn : ''].filter(Boolean).join(' ')}
            >
              {c}
            </button>
          ))}
        </div>
        <Field
          label="City name"
          value={city}
          onChange={onCityChange}
          placeholder="e.g. Indore, Kochi, Jaipur"
        />
      </div>

      <Field
        label="Address (optional)"
        value={address}
        onChange={onAddressChange}
        placeholder="Sector 62, Near metro, Plot 12"
      />
    </div>
  );
}
