'use client';

import { rpcMessage } from '@/lib/format';
import { toast } from '@/lib/toast';
import { useEffect, useRef } from 'react';

export function useToastOnError(error: unknown, fallback = 'Something went wrong') {
  const last = useRef<unknown>(null);

  useEffect(() => {
    if (!error || last.current === error) return;
    last.current = error;
    toast.error(rpcMessage(error, fallback));
  }, [error, fallback]);
}
