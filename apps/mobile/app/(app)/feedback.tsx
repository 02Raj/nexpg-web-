import {
  FEEDBACK_KINDS,
  submitUserFeedback,
  type FeedbackKind,
} from '@/api/feedback';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { Screen } from '@/components/Screen';
import { rpcMessage } from '@/lib/format';
import { useBuilding } from '@/providers/BuildingProvider';
import { colors, radius } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { type } from '@/theme/type';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function FeedbackScreen() {
  const router = useRouter();
  const { building } = useBuilding();
  const [kind, setKind] = useState<FeedbackKind>('problem');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = FEEDBACK_KINDS.find((k) => k.id === kind)!;
  const appSource = Platform.OS === 'ios' ? 'ios' : 'android';

  async function onSend() {
    setError(null);
    if (message.trim().length < 5) {
      setError('Write a few words so we understand.');
      return;
    }
    setBusy(true);
    try {
      await submitUserFeedback({
        kind,
        message,
        buildingId: building?.id,
        appSource,
      });
      setSent(true);
      setMessage('');
    } catch (e) {
      setError(rpcMessage(e, 'Could not send. Try again later.'));
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <Screen scroll>
        <View style={styles.header}>
          <Text style={type.kicker}>Feedback</Text>
          <Text style={type.display}>Got it.</Text>
          <Text style={[type.bodyMuted, { marginTop: 10 }]}>
            We read every note and use it to fix bugs and plan features.
          </Text>
        </View>
        <Button label="Back to settings" variant="secondary" onPress={() => router.back()} />
        <Button label="Send another" variant="ghost" onPress={() => setSent(false)} style={{ marginTop: 10 }} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={type.kicker}>Help us improve</Text>
        <Text style={type.display}>Feedback</Text>
        <Text style={[type.bodyMuted, { marginTop: 10 }]}>
          Bug, stuck, feature idea, or “too hectic” — one tap, short note.
        </Text>
      </View>

      <Text style={type.section}>What is this about?</Text>
      <View style={styles.chips}>
        {FEEDBACK_KINDS.map((item) => {
          const on = kind === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setKind(item.id)}
              style={[styles.chip, on && styles.chipOn]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={[type.small, { marginBottom: 12 }]}>{selected.hint}</Text>

      <Text style={type.section}>Your note</Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        multiline
        maxLength={2000}
        placeholder={
          kind === 'bug'
            ? 'What happened? Which screen?'
            : kind === 'feature'
              ? 'What would help your PG?'
              : kind === 'ux'
                ? 'What felt confusing?'
                : 'What were you trying to do?'
        }
        placeholderTextColor={colors.inkFaint}
        style={styles.input}
        textAlignVertical="top"
      />
      {building ? (
        <Text style={[type.small, { marginTop: 8 }]}>Linked to PG: {building.name}</Text>
      ) : null}

      <ErrorText message={error} />
      <Button
        label={busy ? 'Sending…' : 'Send feedback'}
        onPress={onSend}
        disabled={busy}
        style={{ marginTop: 16 }}
      />
      <Button label="Cancel" variant="ghost" onPress={() => router.back()} style={{ marginTop: 10 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    marginBottom: 20,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 6,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
  chipOn: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  chipText: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.ink,
  },
  chipTextOn: {
    color: colors.paper,
  },
  input: {
    marginTop: 8,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 12,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.white,
  },
});
