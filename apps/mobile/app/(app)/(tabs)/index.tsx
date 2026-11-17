import { fetchDashboard, generateInvoices, maybeGenerateInvoices } from '@/api/nexpg';
import { BedGrid } from '@/components/BedGrid';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { LoadingState } from '@/components/LoadingState';
import { PaperGrain } from '@/components/PaperGrain';
import { Screen } from '@/components/Screen';
import { inr, monthLabel, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { colors, radius } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { type } from '@/theme/type';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function DashboardScreen() {
  const router = useRouter();
  const { building, buildings, showSwitcher, selectBuilding } = useBuilding();
  const buildingId = building?.id ?? '';
  const [flash, setFlash] = useState<string | null>(null);

  const dash = useQuery({
    queryKey: keys.dashboard(buildingId),
    queryFn: () => fetchDashboard(buildingId),
    enabled: Boolean(buildingId),
  });

  useEffect(() => {
    if (!buildingId) return;
    maybeGenerateInvoices(buildingId)
      .then((n) => {
        if (n > 0) {
          queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
        }
      })
      .catch(() => undefined);
  }, [buildingId]);

  const gen = useMutation({
    mutationFn: () => generateInvoices(buildingId),
    onSuccess: async (n) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFlash(n === 0 ? 'Bills for this month are already generated.' : `${n} invoice${n === 1 ? '' : 's'} created.`);
      queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
      queryClient.invalidateQueries({ queryKey: keys.invoices(buildingId, dash.data?.period ?? '') });
    },
  });

  if (!building || dash.isLoading) return <LoadingState />;
  if (dash.error) {
    return (
      <Screen>
        <View style={{ padding: 22 }}>
          <ErrorText message={rpcMessage(dash.error)} />
        </View>
      </Screen>
    );
  }

  const d = dash.data!;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <PaperGrain />
        {showSwitcher ? (
          <View style={styles.switcher}>
            {buildings.map((b) => (
              <Pressable
                key={b.id}
                onPress={() => selectBuilding(b.id)}
                style={[styles.chip, b.id === building.id && styles.chipOn]}
              >
                <Text style={[styles.chipText, b.id === building.id && styles.chipTextOn]}>{b.name}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={type.kicker}>{building.city}</Text>
        )}
        <Text style={type.display}>{building.name}</Text>
        <Text style={type.bodyMuted}>{monthLabel(d.period)}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{d.occupied}</Text>
          <Text style={styles.statLabel}>Occupied</Text>
        </View>
        <View style={styles.rule} />
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: colors.red }]}>{d.empty}</Text>
          <Text style={styles.statLabel}>Empty</Text>
        </View>
      </View>

      <View style={styles.money}>
        <Text style={type.kicker}>This month</Text>
        <Text style={type.amountLg}>{inr(d.collected)}</Text>
        <Text style={type.small}>Collected</Text>
        <View style={styles.alerts}>
          <Text style={styles.alert}>
            Pending {inr(d.pending)}
            {d.pendingCount ? ` · ${d.pendingCount}` : ''}
          </Text>
          <Text style={[styles.alert, { color: colors.ochreDeep }]}>
            Security refund due {inr(d.refundDueAmount)}
            {d.refundDueCount ? ` · ${d.refundDueCount}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="Add tenant"
          onPress={() => router.push('/(app)/tenant/new')}
          style={{ flex: 1 }}
        />
        <Button
          label={gen.isPending ? 'Billing…' : 'Generate bills'}
          variant="secondary"
          disabled={gen.isPending}
          onPress={() => gen.mutate()}
          style={{ flex: 1 }}
        />
      </View>
      <ErrorText message={gen.error ? rpcMessage(gen.error) : flash} />

      <View style={styles.gridBlock}>
        <Text style={type.section}>Beds</Text>
        {d.occupancy.length === 0 ? (
          <Text style={type.bodyMuted}>Add rooms first — go to the More tab.</Text>
        ) : (
          <BedGrid
            beds={d.occupancy}
            onSelect={(bed) => {
              if (bed.tenant) router.push(`/(app)/tenant/${bed.tenant.id}`);
              else router.push({ pathname: '/(app)/tenant/new', params: { bedId: bed.id } });
            }}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    paddingBottom: 8,
    overflow: 'hidden',
    minHeight: 140,
    gap: 4,
  },
  switcher: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipOn: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.inkMuted,
  },
  chipTextOn: {
    color: colors.paper,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
    marginTop: 8,
  },
  stat: {
    flex: 1,
  },
  rule: {
    width: 1,
    height: 36,
    backgroundColor: colors.line,
  },
  statNum: {
    fontFamily: fonts.monoBold,
    fontSize: 36,
    color: colors.green,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: 2,
  },
  money: {
    paddingVertical: 22,
    gap: 4,
  },
  alerts: {
    marginTop: 12,
    gap: 4,
  },
  alert: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.red,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  gridBlock: {
    marginTop: 20,
    gap: 14,
  },
});
