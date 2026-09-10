import { QueryClient, keepPreviousData } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60_000,
      gcTime: 15 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchIntervalInBackground: false,
      networkMode: 'offlineFirst',
      placeholderData: keepPreviousData,
    },
    mutations: {
      retry: 0,
      networkMode: 'offlineFirst',
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
  apkRequestsAdmin: ['apk-requests-admin'] as const,
  contactInquiries: ['contact-inquiries'] as const,
  platformDashboard: ['platform-dashboard'] as const,
  platformOwners: ['platform-owners'] as const,
  ownerProfile: ['owner-profile'] as const,
};
