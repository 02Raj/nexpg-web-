import { fetchTenantDirectory } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { keys } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { colors, radius } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { type } from '@/theme/type';
import type { Tenant } from '@nexpg/shared';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Linking, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';

const TEMPLATES = [
  {
    id: 'water',
    title: '💧 Water supply',
    text: (bName: string) => `Notice for residents of ${bName}: Water supply will be temporarily unavailable today from 2:00 PM to 5:00 PM due to overhead tank maintenance. Kindly store water accordingly.`,
  },
  {
    id: 'power',
    title: '⚡ Power / Generator',
    text: (bName: string) => `Notice for residents of ${bName}: Electrical maintenance and generator servicing scheduled today. Power may be intermittent for 1-2 hours.`,
  },
  {
    id: 'wifi',
    title: '📶 Wi-Fi upgrade',
    text: (bName: string) => `Notice for residents of ${bName}: Wi-Fi fiber router is undergoing routine maintenance. Speeds may vary for the next 30 minutes.`,
  },
  {
    id: 'gate',
    title: '🚪 Gate timings',
    text: (bName: string) => `Notice for residents of ${bName}: A friendly reminder that main gate closes at 10:30 PM. Please inform the caretaker in advance for late returns.`,
  },
  {
    id: 'rent',
    title: '💵 Rent reminder',
    text: (bName: string) => `Notice for residents of ${bName}: Monthly rent is due. Please clear your dues using UPI or cash with the caretaker today. Thank you.`,
  },
];

export default function NoticesScreen() {
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';
  const buildingName = building?.name ?? 'our PG';

  const { data: tenants, isLoading } = useQuery({
    queryKey: keys.tenants(buildingId),
    queryFn: () => fetchTenantDirectory(buildingId),
    enabled: Boolean(buildingId),
  });

  const [message, setMessage] = useState(TEMPLATES[0].text(buildingName));

  if (isLoading) return <LoadingState />;

  const activeTenants: Tenant[] = (tenants ?? []).filter((t: Tenant) => t.status === 'active');

  const handleShareNotice = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await Share.share({
      title: `Notice from ${buildingName}`,
      message: `${message}\n\n— Management, ${buildingName}`,
    });
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    void Linking.openURL(`https://wa.me/?text=${encoded}`);
  };

  return (
    <Screen scroll>
      <View style={{ paddingTop: 16, marginBottom: 16, gap: 4 }}>
        <Text style={type.kicker}>Tenant broadcast</Text>
        <Text style={type.display}>Announcements.</Text>
        <Text style={type.bodyMuted}>
          {activeTenants.length} active occupant{activeTenants.length === 1 ? '' : 's'} in {buildingName}.
        </Text>
      </View>

      <Text style={type.section}>Quick notice templates</Text>
      <View style={styles.chipRow}>
        {TEMPLATES.map((tmpl) => (
          <Pressable
            key={tmpl.id}
            onPress={() => setMessage(tmpl.text(buildingName))}
            style={styles.chip}
          >
            <Text style={styles.chipText}>{tmpl.title}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[type.section, { marginTop: 16 }]}>Notice message</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={5}
        value={message}
        onChangeText={setMessage}
        placeholder="Type notice message here..."
        placeholderTextColor="#888"
      />

      <View style={{ marginTop: 16, gap: 10 }}>
        <Button
          label="📢 Share Notice (WhatsApp / SMS / Any App)"
          variant="primary"
          onPress={handleShareNotice}
        />
        <Button
          label="Open direct in WhatsApp"
          variant="secondary"
          onPress={handleOpenWhatsApp}
        />
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>💡 Quick Tip for PG Owners:</Text>
        <Text style={styles.tipText}>
          Tapping &apos;Share Notice&apos; lets you share directly to your building&apos;s WhatsApp Group or WhatsApp Broadcast list in 1 tap!
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipText: {
    fontFamily: fonts.bodySemi,
    color: colors.ink,
    fontSize: 13,
  },
  textArea: {
    marginTop: 10,
    backgroundColor: colors.white,
    color: colors.ink,
    fontFamily: fonts.body,
    padding: 14,
    borderRadius: radius.md,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 110,
    borderWidth: 1,
    borderColor: colors.line,
    textAlignVertical: 'top',
  },
  tipBox: {
    marginTop: 24,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.paperDeep,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tipTitle: {
    fontFamily: fonts.bodySemi,
    color: colors.ink,
    fontSize: 14,
    marginBottom: 6,
  },
  tipText: {
    fontFamily: fonts.body,
    color: colors.inkMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
});
