import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { Field } from '@/components/Field';
import { PaperGrain } from '@/components/PaperGrain';
import { Screen } from '@/components/Screen';
import { APP_DISPLAY_NAME } from '@/lib/brand';
import { rpcMessage } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { type } from '@/theme/type';
import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGoogleSignIn = async () => {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(rpcMessage(e, 'Google sign in failed'));
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async () => {
    setError(null);
    setBusy(true);
    try {
      await signIn(email, password);
    } catch (e) {
      setError(rpcMessage(e, 'Could not sign in'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <PaperGrain />
        <Text style={type.kicker}>Owner console</Text>
        <Text style={type.display}>{APP_DISPLAY_NAME}</Text>
        <Text style={[type.bodyMuted, styles.lede]}>
          Beds, rent, bills, and security — all in one place. Nothing extra.
        </Text>
      </View>

      <View style={styles.form}>
        <Button
          label="Continue with Google"
          variant="secondary"
          onPress={onGoogleSignIn}
          disabled={busy}
        />
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or sign in with email</Text>
          <View style={styles.dividerLine} />
        </View>

        <Field
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@pg.co"
        />
        <Field
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
        />
        <ErrorText message={error} />
        <Link href="/(auth)/forgot-password" style={styles.forgot}>
          Forgot password?
        </Link>
        <Button label={busy ? 'Signing in…' : 'Enter'} onPress={onSubmit} disabled={busy || !email || !password} />
        <Link href="/(auth)/signup" style={styles.link}>
          New owner? Create account
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 36,
    paddingBottom: 28,
    overflow: 'hidden',
    minHeight: 220,
  },
  lede: {
    marginTop: 10,
    maxWidth: 280,
  },
  form: {
    gap: 14,
  },
  forgot: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: 'right',
    marginTop: -6,
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
