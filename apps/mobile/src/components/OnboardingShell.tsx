import { Screen } from '@/components/Screen';
import { ONBOARDING_STEPS } from '@/lib/onboarding';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { type } from '@/theme/type';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  step: number;
  title: string;
  subtitle?: string;
  onSkip?: () => void;
  skipLabel?: string;
  children: ReactNode;
};

export function OnboardingShell({ step, title, subtitle, onSkip, skipLabel = 'Skip', children }: Props) {
  const progress = step / ONBOARDING_STEPS;

  return (
    <Screen scroll>
      <View style={styles.top}>
        <View style={styles.meta}>
          <Text style={styles.step}>
            Step {step} of {ONBOARDING_STEPS}
          </Text>
          {onSkip ? (
            <Pressable onPress={onSkip} hitSlop={12}>
              <Text style={styles.skip}>{skipLabel}</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={type.display}>{title}</Text>
        {subtitle ? <Text style={[type.bodyMuted, styles.sub]}>{subtitle}</Text> : null}
      </View>

      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    paddingTop: space.sm,
    marginBottom: space.lg,
    gap: 10,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  step: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.inkFaint,
  },
  skip: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.ochreDeep,
  },
  track: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.paperDeep,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.ochre,
    borderRadius: radius.pill,
  },
  hero: {
    marginBottom: space.lg,
    gap: 8,
  },
  sub: {
    maxWidth: 320,
  },
});
