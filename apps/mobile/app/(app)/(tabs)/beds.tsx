import { fetchOccupancy } from '@/api/nexpg';
import { BedGrid } from '@/components/BedGrid';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { keys } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { type } from '@/theme/type';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function BedsScreen() {
  const router = useRouter();
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';
  const q = useQuery({
    queryKey: keys.occupancy(buildingId),
    queryFn: () => fetchOccupancy(buildingId),
    enabled: Boolean(buildingId),
  });

  if (!building || q.isLoading) return <LoadingState />;

  return (
    <Screen scroll>
      <View style={{ paddingTop: 16, gap: 6, marginBottom: 20 }}>
        <Text style={type.kicker}>Occupancy</Text>
        <Text style={type.display}>Every bed.</Text>
        <Text style={type.bodyMuted}>Tap occupied to open tenant. Tap empty to add.</Text>
      </View>
      <BedGrid
        beds={q.data ?? []}
        onSelect={(bed) => {
          if (bed.tenant) router.push(`/(app)/tenant/${bed.tenant.id}`);
          else router.push({ pathname: '/(app)/tenant/new', params: { bedId: bed.id } });
        }}
      />
    </Screen>
  );
}
