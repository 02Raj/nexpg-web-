import { Button } from '@/components/Button';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { authErrorFromUrl, createSessionFromUrl } from '@/lib/auth-link';
import { type } from '@/theme/type';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const url =
        Platform.OS === 'web' && typeof window !== 'undefined'
          ? window.location.href
          : await Linking.getInitialURL();

      if (!url) {
        if (active) setMessage('No confirmation link found.');
        return;
      }

      const preview = authErrorFromUrl(url);
      if (preview) {
        if (active) setMessage(preview);
        return;
      }

      try {
        await createSessionFromUrl(url);
        if (active) router.replace('/(app)/(tabs)');
      } catch (e) {
        if (active) setMessage(e instanceof Error ? e.message : 'Email confirmation failed.');
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [router]);

  if (message) {
    return (
      <Screen>
        <View style={{ padding: 24, gap: 14 }}>
          <Text style={type.section}>Email link</Text>
          <Text style={type.bodyMuted}>{message}</Text>
          <Text style={type.small}>
            For testing: Supabase → Authentication → Providers → Email → turn Confirm email OFF.
            Then sign up again in the app — no email link needed.
          </Text>
          <Button label="Go to login" onPress={() => router.replace('/(auth)/login')} />
        </View>
      </Screen>
    );
  }

  return <LoadingState label="Confirming email…" />;
}
