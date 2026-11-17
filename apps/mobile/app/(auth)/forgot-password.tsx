import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { rpcMessage } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { type } from '@/theme/type';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setBusy(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (e) {
      setError(rpcMessage(e, 'Could not send reset email'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll>
      <Pressable onPress={() => router.back()} style={{ paddingTop: 8, paddingBottom: 12 }}>
        <Text style={[type.small, { color: colors.ochreDeep }]}>Back</Text>
      </Pressable>

      <View style={styles.hero}>
        <Text style={type.kicker}>Account</Text>
        <Text style={type.display}>Reset password</Text>
        <Text style={[type.bodyMuted, { marginTop: 10 }]}>
          Enter your email. We will send a link to choose a new password.
        </Text>
      </View>

      {sent ? (
        <View style={styles.form}>
          <Text style={type.section}>Check your email</Text>
          <Text style={type.bodyMuted}>
            If an account exists for {email.trim()}, a reset link is on its way. Open it on this
            phone so the app can set your new password.
          </Text>
          <Button label="Back to login" onPress={() => router.replace('/(auth)/login')} />
        </View>
      ) : (
        <View style={styles.form}>
          <Field
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@pg.co"
          />
          <ErrorText message={error} />
          <Button
            label={busy ? 'Sending…' : 'Send reset link'}
            onPress={onSubmit}
            disabled={busy || !email.includes('@')}
          />
          <Link href="/(auth)/login" style={styles.link}>
            Back to login
          </Link>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingBottom: 22,
  },
  form: {
    gap: 14,
  },
  link: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.ochreDeep,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
