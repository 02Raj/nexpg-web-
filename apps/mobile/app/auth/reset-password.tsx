import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { Field } from '@/components/Field';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { authErrorFromUrl, createSessionFromUrl } from '@/lib/auth-link';
import { rpcMessage } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { type } from '@/theme/type';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const consumeUrl = async (url: string | null) => {
      if (!url) {
        if (active) {
          setLinkError('Open the reset link from your email on this device.');
          setReady(true);
        }
        return;
      }

      const preview = authErrorFromUrl(url);
      if (preview) {
        if (active) {
          setLinkError(preview);
          setReady(true);
        }
        return;
      }

      try {
        await createSessionFromUrl(url);
        if (active) setReady(true);
      } catch (e) {
        if (active) {
          setLinkError(e instanceof Error ? e.message : 'This reset link is invalid or expired.');
          setReady(true);
        }
      }
    };

    const bootstrap = async () => {
      const initial =
        Platform.OS === 'web' && typeof window !== 'undefined'
          ? window.location.href
          : await Linking.getInitialURL();
      await consumeUrl(initial);
    };

    bootstrap();
    const sub = Linking.addEventListener('url', ({ url }) => consumeUrl(url));
    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  const onSubmit = async () => {
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setError(null);
    setBusy(true);
    try {
      await updatePassword(password);
      router.replace('/(app)/(tabs)');
    } catch (e) {
      setError(rpcMessage(e, 'Could not update password'));
    } finally {
      setBusy(false);
    }
  };

  if (!ready) return <LoadingState label="Verifying reset link…" />;

  if (linkError) {
    return (
      <Screen>
        <View style={{ padding: 24, gap: 14 }}>
          <Text style={type.section}>Reset link</Text>
          <Text style={type.bodyMuted}>{linkError}</Text>
          <Button label="Request a new link" onPress={() => router.replace('/(auth)/forgot-password')} />
          <Button label="Back to login" variant="ghost" onPress={() => router.replace('/(auth)/login')} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={{ paddingTop: 24, gap: 6, marginBottom: 20 }}>
        <Text style={type.kicker}>Account</Text>
        <Text style={type.display}>New password</Text>
        <Text style={type.bodyMuted}>Choose a password you will use to sign in.</Text>
      </View>

      <Field
        label="New password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        hint="At least 8 characters"
      />
      <View style={{ height: 12 }} />
      <Field label="Confirm password" secureTextEntry value={confirm} onChangeText={setConfirm} />
      <View style={{ height: 16 }} />
      <ErrorText message={error} />
      <Button
        label={busy ? 'Saving…' : 'Update password'}
        onPress={onSubmit}
        disabled={busy || password.length < 8 || confirm.length < 8}
      />
    </Screen>
  );
}
