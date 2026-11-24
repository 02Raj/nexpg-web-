import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { rpcMessage } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { type } from '@/theme/type';
import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SignupScreen() {
  const { signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onGoogleSignUp = async () => {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(rpcMessage(e, 'Google sign up failed'));
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async () => {
    setError(null);
    setBusy(true);
    try {
      await signUp(email, password, name);
      setDone(true);
    } catch (e) {
      setError(rpcMessage(e, 'Could not create account'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <Text style={type.kicker}>Start</Text>
        <Text style={type.display}>Your PG,{'\n'}on paper.</Text>
        <Text style={[type.bodyMuted, { marginTop: 10 }]}>
          Owner login only. Caretaker access is not available in this version.
        </Text>
      </View>
      <View style={styles.form}>
        {done ? (
          <>
            <Text style={type.section}>Account created</Text>
            <Text style={type.bodyMuted}>
              Account created. You can sign in right away — no email confirmation required.
            </Text>
            <Link href="/(auth)/login" style={styles.link}>
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <Button
              label="Continue with Google"
              variant="secondary"
              onPress={onGoogleSignUp}
              disabled={busy}
            />
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign up with email</Text>
              <View style={styles.dividerLine} />
            </View>

            <Field label="Your name" value={name} onChangeText={setName} placeholder="Rahul" />
            <Field
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Field
              label="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              hint="8+ characters"
            />
            <ErrorText message={error} />
            <Button
              label={busy ? 'Creating…' : 'Create owner account'}
              onPress={onSubmit}
              disabled={busy || name.length < 2 || !email || password.length < 8}
            />
            <Link href="/(auth)/login" style={styles.link}>
              Already have an account
            </Link>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 28,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkMuted,
  },
});
