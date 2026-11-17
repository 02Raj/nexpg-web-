import { colors } from '@/theme/tokens';
import { type } from '@/theme/type';
import { StyleSheet, Text, View } from 'react-native';

export function ErrorText({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.redSoft,
    padding: 12,
    borderRadius: 8,
  },
  text: {
    ...type.small,
    color: colors.red,
  },
});
