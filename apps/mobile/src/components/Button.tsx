import { colors, radius } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', disabled, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, variant === 'ghost' && styles.ghostText, variant === 'secondary' && styles.secondaryText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: colors.ink,
  },
  secondary: {
    backgroundColor: colors.ochreSoft,
    borderWidth: 1,
    borderColor: colors.ochre,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.line,
  },
  danger: {
    backgroundColor: colors.red,
  },
  success: {
    backgroundColor: colors.green,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ translateY: 1 }],
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.paper,
  },
  ghostText: {
    color: colors.ink,
  },
  secondaryText: {
    color: colors.ochreDeep,
  },
});
