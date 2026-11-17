import { colors } from '@/theme/tokens';
import { StyleSheet, View } from 'react-native';

/** Quiet occupancy motif — not a decoration dump. */
export function PaperGrain() {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      {Array.from({ length: 7 }).map((_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: 12 }).map((__, col) => (
            <View
              key={col}
              style={[
                styles.dot,
                (row + col) % 5 === 0 && styles.filled,
                (row + col) % 7 === 0 && styles.accent,
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 12,
    right: -8,
    opacity: 0.55,
    gap: 5,
  },
  row: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 7,
    height: 9,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: colors.line,
  },
  filled: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
    opacity: 0.18,
  },
  accent: {
    backgroundColor: colors.ochre,
    borderColor: colors.ochre,
    opacity: 0.35,
  },
});
