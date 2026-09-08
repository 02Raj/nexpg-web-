'use client';

import { createBuilding } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { LocationFields } from '@/components/LocationFields';
import { CITY_STATE_HINT } from '@/lib/locations';
import { rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../setup.module.css';
import formStyles from '../../form-page.module.css';

export default function SetupBuildingPage() {
  const router = useRouter();
  const { selectBuilding } = useBuilding();
  const [name, setName] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [city, setCity] = useState('Noida');
  const [address, setAddress] = useState('');
  const [billing, setBilling] = useState('5');

  const mutate = useMutation({
    mutationFn: () =>
      createBuilding({
        name,
        city,
        state,
        address,
        billing_date: Number(billing),
      }),
    onSuccess: async (building) => {
      selectBuilding(building.id);
      await queryClient.invalidateQueries({ queryKey: keys.buildings });
      router.replace(`/setup/rooms?buildingId=${building.id}`);
    },
  });

  const day = Number(billing);
  const valid =
    name.trim().length >= 2 &&
    city.trim().length >= 2 &&
    state.trim().length >= 2 &&
    day >= 1 &&
    day <= 28;

  return (
    <div className={formStyles.page}>
      <header className={formStyles.header}>
        <p className={formStyles.kicker}>Setup · Step 1 of 2</p>
        <h1 className={formStyles.title}>Add your PG property</h1>
        <p className={formStyles.description}>
          Works across India — pick a popular city or type your own. Same data syncs on web and mobile.
        </p>
      </header>

      <div className={formStyles.card}>
        <div className={formStyles.form}>
          <Field label="PG name" value={name} onChange={setName} placeholder="Sunrise PG for Girls" />
          <LocationFields
            state={state}
            city={city}
            address={address}
            onStateChange={setState}
            onCityChange={(v) => {
              setCity(v);
              const hint = CITY_STATE_HINT[v];
              if (hint) setState(hint);
            }}
            onAddressChange={setAddress}
          />
          <Field
            label="Billing date (1–28)"
            value={billing}
            onChange={setBilling}
            type="number"
            hint="Rent invoices generate on this day each month (IST)."
          />
          {mutate.error ? <p className={styles.error}>{rpcMessage(mutate.error)}</p> : null}
          <Button
            label={mutate.isPending ? 'Saving…' : 'Continue to rooms →'}
            disabled={!valid || mutate.isPending}
            onClick={() => mutate.mutate()}
          />
        </div>
      </div>
    </div>
  );
}
