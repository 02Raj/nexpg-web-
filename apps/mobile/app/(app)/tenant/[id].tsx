import { fetchTenantDetail, markInvoicePaid, markSecurityRefunded, vacateTenant } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { SecurityChip } from '@/components/SecurityChip';
import { inrExact, prettyDate, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { colors, radius } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { type } from '@/theme/type';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function TenantProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { building } = useBuilding();
  const q = useQuery({
    queryKey: keys.tenant(id),
    queryFn: () => fetchTenantDetail(id),
    enabled: Boolean(id),
  });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: keys.tenant(id) }),
      queryClient.invalidateQueries({ queryKey: keys.dashboard(building?.id ?? '') }),
      queryClient.invalidateQueries({ queryKey: keys.occupancy(building?.id ?? '') }),
    ]);
  };

  const vacate = useMutation({
    mutationFn: () => vacateTenant(id),
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await invalidate();
    },
  });

  const refund = useMutation({
    mutationFn: (depositId: string) => markSecurityRefunded(depositId),
    onSuccess: invalidate,
  });

  const pay = useMutation({
    mutationFn: ({ invoiceId, mode }: { invoiceId: string; mode: 'upi' | 'cash' }) =>
      markInvoicePaid(invoiceId, mode),
    onSuccess: invalidate,
  });

  if (q.isLoading) return <LoadingState />;
  if (q.error || !q.data) {
    return (
      <Screen>
        <View style={{ padding: 22 }}>
          <ErrorText message={rpcMessage(q.error, 'Tenant not found')} />
        </View>
      </Screen>
    );
  }

  const { tenant, deposit, invoices, bedLabel } = q.data;

  const confirmVacate = () => {
    Alert.alert(
      'Vacate this tenant?',
      'The bed will be freed. Future rent invoices will stop. Security deposit will move to Refund due.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Vacate', style: 'destructive', onPress: () => vacate.mutate() },
      ],
    );
  };

  return (
    <Screen scroll>
      <Pressable onPress={() => router.back()} style={{ paddingTop: 8, paddingBottom: 12 }}>
        <Text style={[type.small, { color: colors.ochreDeep }]}>Back</Text>
      </Pressable>
      <Text style={type.kicker}>{bedLabel}</Text>
      <Text style={type.display}>{tenant.full_name}</Text>
      <Text style={[type.bodyMuted, { marginTop: 4 }]}>{tenant.phone}</Text>
      <Text style={[type.small, { marginTop: 6 }]}>
        {tenant.status === 'active' ? 'Active' : 'Vacated'} · Joined {prettyDate(tenant.join_date)}
      </Text>

      <View style={styles.rentBox}>
        <Text style={type.kicker}>Monthly rent</Text>
        <Text style={type.amountLg}>{inrExact(tenant.monthly_rent)}</Text>
      </View>

      <View style={styles.secBox}>
        <View style={styles.secRow}>
          <Text style={type.section}>Security</Text>
          {deposit ? <SecurityChip status={deposit.status} /> : null}
        </View>
        <Text style={type.amount}>{inrExact(deposit?.amount ?? 0)}</Text>
        {deposit?.status === 'refund_due' ? (
          <Button
            label={refund.isPending ? 'Saving…' : 'Mark refunded'}
            variant="secondary"
            onPress={() => refund.mutate(deposit.id)}
            disabled={refund.isPending}
            style={{ marginTop: 12 }}
          />
        ) : null}
      </View>

      <Text style={[type.section, { marginTop: 22, marginBottom: 10 }]}>Bills</Text>
      {invoices.length === 0 ? (
        <Text style={type.bodyMuted}>No rent invoices yet.</Text>
      ) : (
        invoices.map((inv) => (
          <View key={inv.id} style={styles.inv}>
            <View style={{ flex: 1 }}>
              <Text style={styles.invAmt}>{inrExact(inv.amount)}</Text>
              <Text style={type.small}>
                {inv.billing_period.slice(0, 7)}
                {inv.is_prorated ? ' · Pro-rated' : ''} · {inv.status === 'paid' ? inv.payment_mode?.toUpperCase() : 'Pending'}
              </Text>
            </View>
            {inv.status === 'pending' ? (
              <View style={{ gap: 6, width: 120 }}>
                <Button
                  label="UPI"
                  variant="success"
                  onPress={() => pay.mutate({ invoiceId: inv.id, mode: 'upi' })}
                />
                <Button
                  label="Cash"
                  variant="ghost"
                  onPress={() => pay.mutate({ invoiceId: inv.id, mode: 'cash' })}
                />
              </View>
            ) : null}
          </View>
        ))
      )}

      {tenant.status === 'active' ? (
        <Button
          label={vacate.isPending ? 'Vacating…' : 'Vacate'}
          variant="danger"
          onPress={confirmVacate}
          disabled={vacate.isPending}
          style={{ marginTop: 28 }}
        />
      ) : null}
      <ErrorText
        message={vacate.error || refund.error || pay.error ? rpcMessage(vacate.error || refund.error || pay.error) : null}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  rentBox: {
    marginTop: 22,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
    gap: 4,
  },
  secBox: {
    marginTop: 18,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 6,
  },
  secRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inv: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  invAmt: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.ink,
  },
});
