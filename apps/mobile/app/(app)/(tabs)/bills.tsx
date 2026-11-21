import { addInvoiceCharge, fetchInvoices, generateInvoices, markInvoicePaid } from '@/api/nexpg';
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
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Linking } from 'react-native';
import { rentReminderUrl } from '@nexpg/shared/reminder';
import { useState } from 'react';

export default function BillsScreen() {
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';
  const period = `${todayIST().slice(0, 8)}01`;

  const [chargeModal, setChargeModal] = useState<{ id: string; tenantName: string } | null>(null);
  const [chargeType, setChargeType] = useState<'meter' | 'custom'>('meter');
  const [prevUnits, setPrevUnits] = useState('');
  const [currUnits, setCurrUnits] = useState('');
  const [ratePerUnit, setRatePerUnit] = useState('10');
  const [customLabel, setCustomLabel] = useState('Maintenance');
  const [customAmount, setCustomAmount] = useState('');

  const meterUnits = Math.max(0, (Number(currUnits) || 0) - (Number(prevUnits) || 0));
  const meterTotal = meterUnits * (Number(ratePerUnit) || 10);

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

  const addCharge = useMutation({
    mutationFn: ({ id, label, amount }: { id: string; label: string; amount: number }) =>
      addInvoiceCharge(id, label, amount),
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: keys.invoices(buildingId, period) });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
      setChargeModal(null);
      setPrevUnits('');
      setCurrUnits('');
      setCustomAmount('');
    },
  });

  const handleAddCharge = () => {
    if (!chargeModal) return;
    if (chargeType === 'meter') {
      if (meterUnits <= 0) return;
      const label = `Electricity (${meterUnits} units @ ₹${ratePerUnit || 10}/unit)`;
      addCharge.mutate({ id: chargeModal.id, label, amount: meterTotal });
    } else {
      const amt = Number(customAmount);
      if (!Number.isFinite(amt) || amt <= 0) return;
      addCharge.mutate({ id: chargeModal.id, label: customLabel.trim() || 'Extra charge', amount: amt });
    }
  };

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
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <Button
              label="⚡ + Electricity / Extra"
              variant="secondary"
              style={{ flex: 1 }}
              onPress={() => setChargeModal({ id: inv.id, tenantName: inv.tenant?.full_name ?? 'Tenant' })}
            />
          </View>
          {inv.tenant?.phone && rentReminderUrl({ phone: inv.tenant.phone, tenantName: inv.tenant.full_name, amount: inv.amount, period, buildingName: building.name }) ? (
            <Button label="Remind on WhatsApp" variant="secondary" style={{ marginTop: 6 }} onPress={() => {
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

      {chargeModal ? (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={() => setChargeModal(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Extra Charge</Text>
                <Pressable onPress={() => setChargeModal(null)} hitSlop={12}>
                  <Text style={styles.closeBtn}>✕</Text>
                </Pressable>
              </View>
              <Text style={styles.modalSub}>For tenant: {chargeModal.tenantName}</Text>

              <View style={styles.tabRow}>
                <Pressable
                  onPress={() => setChargeType('meter')}
                  style={[styles.tab, chargeType === 'meter' && styles.tabActive]}
                >
                  <Text style={[styles.tabText, chargeType === 'meter' && styles.tabTextActive]}>⚡ Electricity</Text>
                </Pressable>
                <Pressable
                  onPress={() => setChargeType('custom')}
                  style={[styles.tab, chargeType === 'custom' && styles.tabActive]}
                >
                  <Text style={[styles.tabText, chargeType === 'custom' && styles.tabTextActive]}>➕ Other</Text>
                </Pressable>
              </View>

              {chargeType === 'meter' ? (
                <View style={{ gap: 10, marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>Previous units</Text>
                      <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        placeholder="120"
                        placeholderTextColor="#777"
                        value={prevUnits}
                        onChangeText={setPrevUnits}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>Current units</Text>
                      <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        placeholder="165"
                        placeholderTextColor="#777"
                        value={currUnits}
                        onChangeText={setCurrUnits}
                      />
                    </View>
                  </View>

                  <View>
                    <Text style={styles.inputLabel}>Rate per unit (₹)</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="number-pad"
                      placeholder="10"
                      placeholderTextColor="#777"
                      value={ratePerUnit}
                      onChangeText={setRatePerUnit}
                    />
                  </View>

                  <View style={styles.calcBox}>
                    <Text style={styles.calcText}>Units consumed: {meterUnits}</Text>
                    <Text style={styles.calcTotal}>Amount: {inrExact(meterTotal)}</Text>
                  </View>
                </View>
              ) : (
                <View style={{ gap: 10, marginTop: 12 }}>
                  <View>
                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Maintenance / Food / Laundry"
                      placeholderTextColor="#777"
                      value={customLabel}
                      onChangeText={setCustomLabel}
                    />
                  </View>
                  <View>
                    <Text style={styles.inputLabel}>Amount (₹)</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="number-pad"
                      placeholder="500"
                      placeholderTextColor="#777"
                      value={customAmount}
                      onChangeText={setCustomAmount}
                    />
                  </View>
                </View>
              )}

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                <Button label="Cancel" variant="secondary" style={{ flex: 1 }} onPress={() => setChargeModal(null)} />
                <Button
                  label={addCharge.isPending ? 'Adding…' : 'Add to Bill'}
                  variant="primary"
                  style={{ flex: 1 }}
                  onPress={handleAddCharge}
                  disabled={addCharge.isPending}
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg ?? 16,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: colors.line,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: fonts.bodySemi,
    fontSize: 18,
    color: colors.ink,
  },
  modalSub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted ?? '#666',
    marginTop: 4,
    marginBottom: 14,
  },
  closeBtn: {
    fontSize: 18,
    color: colors.inkMuted ?? '#888',
    padding: 4,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.sm ?? 8,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    backgroundColor: colors.paper,
  },
  tabActive: {
    borderColor: colors.ink,
    backgroundColor: colors.ink,
  },
  tabText: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.ink,
  },
  tabTextActive: {
    color: colors.white,
  },
  inputLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.ink,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm ?? 8,
    padding: 10,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.ink,
    backgroundColor: colors.white,
  },
  calcBox: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: radius.sm ?? 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    padding: 10,
    marginTop: 4,
  },
  calcText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
  },
  calcTotal: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    color: colors.green,
    marginTop: 2,
  },
});
