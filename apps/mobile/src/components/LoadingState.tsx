import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { type } from '@/theme/type';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.ochre} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.paper,
  },
  label: {
    ...type.small,
    fontFamily: fonts.bodyMedium,
  },
});
