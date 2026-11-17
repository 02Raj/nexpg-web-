import { colors, radius } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import type { SecurityStatus } from '@/types/database';
import { StyleSheet, Text, View } from 'react-native';

const copy: Record<SecurityStatus, { label: string; bg: string; fg: string }> = {
  held: { label: 'Held', bg: colors.greenSoft, fg: colors.green },
  refund_due: { label: 'Refund due', bg: colors.redSoft, fg: colors.red },
  refunded: { label: 'Refunded', bg: colors.paperDeep, fg: colors.inkMuted },
};

export function SecurityChip({ status }: { status: SecurityStatus }) {
  const t = copy[status];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }]}>
      <Text style={[styles.text, { color: t.fg }]}>{t.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  text: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
