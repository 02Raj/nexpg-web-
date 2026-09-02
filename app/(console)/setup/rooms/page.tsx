'use client';

import { addRoomWithBeds } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from '../setup.module.css';

export default function SetupRoomsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const buildingId = params.get('buildingId') ?? '';
  const [roomName, setRoomName] = useState('');
  const [beds, setBeds] = useState('2');
  const [added, setAdded] = useState(0);

  const mutate = useMutation({
    mutationFn: () => addRoomWithBeds(buildingId, roomName, Number(beds)),
    onSuccess: async () => {
      setRoomName('');
      setAdded((n) => n + 1);
      await queryClient.invalidateQueries({ queryKey: keys.occupancy(buildingId) });
    },
  });

  if (!buildingId) {
    router.replace('/setup/building');
    return null;
  }

  return (
    <div className={styles.page}>
      <p className="kicker">Rooms</p>
      <h1 className="display">Add rooms & beds.</h1>
      <p className="bodyMuted">Add at least one room before adding tenants.</p>
      <div className={styles.form}>
        <Field label="Room name" value={roomName} onChange={setRoomName} placeholder="101" />
        <Field label="Beds" value={beds} onChange={setBeds} type="number" hint="1 to 8" />
        {mutate.error ? <p className={styles.error}>{rpcMessage(mutate.error)}</p> : null}
        <Button label={mutate.isPending ? 'Adding…' : 'Add room'} disabled={!roomName || mutate.isPending} onClick={() => mutate.mutate()} />
        {added > 0 ? <p className="small">{added} room{added === 1 ? '' : 's'} added.</p> : null}
        <Button label="Go to dashboard" variant="secondary" onClick={() => router.replace('/dashboard')} />
      </div>
    </div>
  );
}
