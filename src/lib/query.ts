import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export const keys = {
  buildings: ['buildings'] as const,
  dashboard: (buildingId: string) => ['dashboard', buildingId] as const,
  occupancy: (buildingId: string) => ['occupancy', buildingId] as const,
  invoices: (buildingId: string, period: string) => ['invoices', buildingId, period] as const,
  tenant: (tenantId: string) => ['tenant', tenantId] as const,
  apkRequest: ['apk-request'] as const,
};
