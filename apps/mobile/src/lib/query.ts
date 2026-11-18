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
  occupancy: (buildingId: string) => ['occupancy', buildingId] as const,
  dashboard: (buildingId: string) => ['dashboard', buildingId] as const,
  invoices: (buildingId: string, period: string) =>
    ['invoices', buildingId, period] as const,
  tenant: (id: string) => ['tenant', id] as const,
  emptyBeds: (buildingId: string) => ['empty-beds', buildingId] as const,
  tickets: (buildingId: string) => ['tickets', buildingId] as const,
  guests: (buildingId: string) => ['guests', buildingId] as const,
};
