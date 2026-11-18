import { fetchInvoices, generateInvoices, markInvoicePaid } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { inrExact, monthLabel, rpcMessage, todayIST } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { colors, radius } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { type } from '@/theme/type';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View } from 'react-native';
import { Linking } from 'react-native';
import { rentReminderUrl } from '@nexpg/shared/reminder';

export default function BillsScreen() {
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';
  const period = `${todayIST().slice(0, 8)}01`;

  const q = useQuery({
    queryKey: keys.invoices(buildingId, period),
    queryFn: () => fetchInvoices(buildingId, period),
    enabled: Boolean(buildingId),
  });

  const pay = useMutation({
    mutationFn: ({ id, mode }: { id: string; mode: 'upi' | 'bank' | 'cash' }) => markInvoicePaid(id, mode),
    onSuccess: async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      queryClient.invalidateQueries({ queryKey: keys.invoices(buildingId, period) });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
    },
  });

  const gen = useMutation({
    mutationFn: () => generateInvoices(buildingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.invoices(buildingId, period) });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
    },
  });

  if (!building || q.isLoading) return <LoadingState />;
  const rows = q.data ?? [];
  const pending = rows.filter((r) => r.status === 'pending');
  const paid = rows.filter((r) => r.status === 'paid');

  return (
    <Screen scroll>
      <View style={{ paddingTop: 16, marginBottom: 18, gap: 4 }}>
        <Text style={type.kicker}>Rent invoices</Text>
        <Text style={type.display}>{monthLabel(period)}</Text>
        <Text style={type.bodyMuted}>Security deposit is never in this list.</Text>
      </View>

      {rows.length === 0 ? (
        <View style={styles.empty}>
          <Text style={type.bodyMuted}>No bills for this month yet. They are created automatically after the billing date — or tap Generate bills.</Text>
          <Button label={gen.isPending ? 'Working…' : 'Generate bills'} onPress={() => gen.mutate()} disabled={gen.isPending} />
          <ErrorText message={gen.error ? rpcMessage(gen.error) : null} />
        </View>
      ) : null}

      {pending.length > 0 ? <Text style={styles.group}>Pending</Text> : null}
      {pending.map((inv) => (
        <View key={inv.id} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.name}>{inv.tenant?.full_name ?? 'Tenant'}</Text>
            <Text style={styles.amt}>{inrExact(inv.amount)}</Text>
          </View>
          {inv.is_prorated ? <Text style={styles.prorate}>Pro-rated first month</Text> : null}
          <View style={styles.payRow}>
            <Button
              label="Paid — UPI"
              variant="success"
              style={{ flex: 1 }}
              disabled={pay.isPending}
              onPress={() => pay.mutate({ id: inv.id, mode: 'upi' })}
            />
            <Button
              label="Paid — Cash"
              variant="secondary"
              style={{ flex: 1 }}
              disabled={pay.isPending}
              onPress={() => pay.mutate({ id: inv.id, mode: 'cash' })}
            />
            <Button label="Bank" variant="secondary" disabled={pay.isPending} onPress={() => pay.mutate({ id: inv.id, mode: 'bank' })} />
          </View>
          {inv.tenant?.phone && rentReminderUrl({ phone: inv.tenant.phone, tenantName: inv.tenant.full_name, amount: inv.amount, period, buildingName: building.name }) ? (
            <Button label="Remind on WhatsApp" variant="secondary" onPress={() => {
              const url = rentReminderUrl({ phone: inv.tenant!.phone, tenantName: inv.tenant!.full_name, amount: inv.amount, period, buildingName: building.name });
              if (url) void Linking.openURL(url);
            }} />
          ) : null}
        </View>
      ))}

      {paid.length > 0 ? <Text style={styles.group}>Paid</Text> : null}
      {paid.map((inv) => (
        <View key={inv.id} style={[styles.card, styles.paidCard]}>
          <View style={styles.cardTop}>
            <Text style={styles.name}>{inv.tenant?.full_name ?? 'Tenant'}</Text>
            <Text style={styles.amt}>{inrExact(inv.amount)}</Text>
          </View>
          <Text style={styles.paidMeta}>
            {inv.payment_mode === 'upi' ? 'UPI' : inv.payment_mode === 'bank' ? 'Bank transfer' : 'Cash'}
            {inv.is_prorated ? ' · Pro-rated' : ''}
          </Text>
        </View>
      ))}
      <ErrorText message={pay.error ? rpcMessage(pay.error) : null} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    gap: 16,
    paddingVertical: 12,
  },
  group: {
    ...type.kicker,
    marginTop: 8,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 10,
    gap: 8,
  },
  paidCard: {
    backgroundColor: colors.paperDeep,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
  },
  name: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.ink,
    flex: 1,
  },
  amt: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.ink,
  },
  prorate: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.ochreDeep,
  },
  payRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  paidMeta: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.green,
  },
});
