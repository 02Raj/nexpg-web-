import { Button } from '@/components/Button';
import { OnboardingShell } from '@/components/OnboardingShell';
import { completeOnboarding } from '@/lib/onboarding';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/type';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const NEXT = [
  { n: '1', t: 'Add a tenant', d: 'Home → Add tenant → pick an empty bed' },
  { n: '2', t: 'Generate bills', d: 'Bills tab or dashboard → Generate bills' },
  { n: '3', t: 'Mark paid', d: 'Tap Paid — UPI or Paid — Cash on each invoice' },
];

export default function OnboardingDoneScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const finish = async () => {
    if (user?.id) await completeOnboarding(user.id);
    router.replace('/(app)/(tabs)');
  };

  return (
    <OnboardingShell
      step={4}
      title="You are set"
      subtitle="Your PG is ready. Here is what to do next."
    >
      <View style={styles.list}>
        {NEXT.map((item) => (
          <View key={item.n} style={styles.item}>
            <Text style={styles.num}>{item.n}</Text>
            <View style={{ flex: 1 }}>
              <Text style={type.section}>{item.t}</Text>
              <Text style={type.small}>{item.d}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{ height: 24 }} />
      <Button label="Open dashboard" onPress={finish} />
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  item: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
  },
  num: {
    fontFamily: 'IBMPlexMono_600SemiBold',
    fontSize: 18,
    color: colors.ochre,
    width: 24,
  },
});
