import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { StyleSheet, TextStyle } from 'react-native';

export const type = StyleSheet.create({
  kicker: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.inkFaint,
  } as TextStyle,
  display: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.ink,
    letterSpacing: -0.6,
  } as TextStyle,
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 30,
    color: colors.ink,
    letterSpacing: -0.3,
  } as TextStyle,
  section: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 24,
    color: colors.ink,
  } as TextStyle,
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  } as TextStyle,
  bodyMuted: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
  } as TextStyle,
  small: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkMuted,
  } as TextStyle,
  amount: {
    fontFamily: fonts.mono,
    fontSize: 22,
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  } as TextStyle,
  amountLg: {
    fontFamily: fonts.monoBold,
    fontSize: 28,
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  } as TextStyle,
});
