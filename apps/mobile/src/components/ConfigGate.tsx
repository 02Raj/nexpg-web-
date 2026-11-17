import { env } from '@/lib/env';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/type';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';

export function ConfigGate() {
  if (env.isConfigured) return null;
  return (
    <Screen>
      <View style={styles.wrap}>
        <Text style={type.kicker}>Setup</Text>
        <Text style={[type.display, styles.title]}>Connect Supabase</Text>
        <Text style={type.bodyMuted}>
          Dummy keys are in `.env`. Create a Supabase project, run `supabase/migrations/0001_nexpg_mvp.sql`, then replace:
        </Text>
        <View style={styles.code}>
          <Text style={styles.mono}>EXPO_PUBLIC_SUPABASE_URL</Text>
          <Text style={styles.mono}>EXPO_PUBLIC_SUPABASE_ANON_KEY</Text>
        </View>
        <Text style={type.small}>
          Auth → disable “Confirm email” while you test. Restart Expo after saving `.env`.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 22,
    justifyContent: 'center',
    gap: 14,
  },
  title: {
    marginBottom: 4,
  },
  code: {
    backgroundColor: colors.paperDeep,
    padding: 14,
    borderRadius: 10,
    gap: 6,
  },
  mono: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 13,
    color: colors.ink,
  },
});
