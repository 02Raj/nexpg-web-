import { APP_DISPLAY_NAME } from '@/lib/brand';
import { Button } from '@/components/Button';
import { OnboardingShell } from '@/components/OnboardingShell';
import { PaperGrain } from '@/components/PaperGrain';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/type';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const POINTS = [
  'See which beds are occupied at a glance',
  'Track rent bills and mark UPI or cash payments',
  'Keep security deposits separate from rent',
];

export default function OnboardingWelcomeScreen() {
  const router = useRouter();

  return (
    <OnboardingShell
      step={1}
      title={`Welcome to ${APP_DISPLAY_NAME}`}
      subtitle="A simple owner console for your PG — beds, rent, bills, and security."
      onSkip={() => router.replace('/(app)/onboarding/property')}
      skipLabel="Skip intro"
    >
      <View style={styles.card}>
        <PaperGrain />
        {POINTS.map((line) => (
          <View key={line} style={styles.row}>
            <View style={styles.dot} />
            <Text style={type.body}>{line}</Text>
          </View>
        ))}
      </View>
      <View style={{ height: 24 }} />
      <Button label="Get started" onPress={() => router.push('/(app)/onboarding/property')} />
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    gap: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ochre,
    marginTop: 7,
  },
});
