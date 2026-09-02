'use client';

import { createBuilding } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../setup.module.css';
import formStyles from '../../form-page.module.css';

const CITIES = ['Noida', 'Gurgaon', 'Delhi', 'Ghaziabad', 'Bangalore', 'Pune'];

export default function SetupBuildingPage() {
  const router = useRouter();
  const { selectBuilding } = useBuilding();
  const [name, setName] = useState('');
  const [city, setCity] = useState('Noida');
  const [billing, setBilling] = useState('5');

  const mutate = useMutation({
    mutationFn: () =>
      createBuilding({ name, city, billing_date: Number(billing) }),
    onSuccess: async (building) => {
      selectBuilding(building.id);
      await queryClient.invalidateQueries({ queryKey: keys.buildings });
      router.replace(`/setup/rooms?buildingId=${building.id}`);
    },
  });

  const day = Number(billing);
  const valid = name.trim().length >= 2 && day >= 1 && day <= 28;

  return (
    <div className={formStyles.page}>
      <header className={formStyles.header}>
        <p className={formStyles.kicker}>SETUP · 01 / 03</p>
        <h1 className={formStyles.title}>Property</h1>
        <p className={formStyles.description}>Name, city, billing date.</p>
      </header>
      
      <div className={formStyles.card}>
        <div className={formStyles.form}>
          <Field label="PG name" value={name} onChange={setName} placeholder="Sunrise PG" />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p className={styles.label}>City</p>
            <div className={styles.chips}>
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={[styles.chip, city === c ? styles.chipOn : ''].filter(Boolean).join(' ')}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          
          <Field label="Billing date (1–28)" value={billing} onChange={setBilling} type="number" />
          
          {mutate.error ? <p className={styles.error}>{rpcMessage(mutate.error)}</p> : null}
          
          <div style={{ marginTop: 8 }}>
            <Button label={mutate.isPending ? 'Saving…' : 'Continue →'} disabled={!valid || mutate.isPending} onClick={() => mutate.mutate()} />
          </div>
        </div>
      </div>
    </div>
  );
}
