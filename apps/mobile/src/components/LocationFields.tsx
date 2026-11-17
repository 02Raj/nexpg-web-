import { Field } from '@/components/Field';
import {
  CITY_STATE_HINT,
  INDIAN_STATES,
  POPULAR_PG_CITIES,
} from '@/lib/locations';
import { colors, radius } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  state: string;
  city: string;
  address: string;
  onStateChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onAddressChange: (v: string) => void;
};

export function LocationFields({
  state,
  city,
  address,
  onStateChange,
  onCityChange,
  onAddressChange,
}: Props) {
  const [stateOpen, setStateOpen] = useState(false);

  const pickCity = (name: string) => {
    onCityChange(name);
    const hint = CITY_STATE_HINT[name];
    if (hint) onStateChange(hint);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>State / UT</Text>
      <Pressable style={styles.select} onPress={() => setStateOpen(true)}>
        <Text style={state ? styles.selectValue : styles.selectPlaceholder}>
          {state || 'Select state'}
        </Text>
      </Pressable>

      <Text style={styles.label}>City</Text>
      <Text style={styles.hint}>Popular IT hubs — or type your own below.</Text>
      <View style={styles.chips}>
        {POPULAR_PG_CITIES.map((c) => (
          <Pressable
            key={c}
            onPress={() => pickCity(c)}
            style={[styles.chip, city === c && styles.chipOn]}
          >
            <Text style={[styles.chipText, city === c && styles.chipTextOn]}>{c}</Text>
          </Pressable>
        ))}
      </View>
      <Field
        label="City name"
        value={city}
        onChangeText={onCityChange}
        placeholder="e.g. Indore, Kochi, Jaipur"
      />
      <Field
        label="Address (optional)"
        value={address}
        onChangeText={onAddressChange}
        placeholder="Sector 62, Near metro, Plot 12"
      />

      <Modal visible={stateOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select state</Text>
              <Pressable onPress={() => setStateOpen(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </Pressable>
            </View>
            <FlatList
              data={[...INDIAN_STATES]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.stateRow, state === item && styles.stateRowOn]}
                  onPress={() => {
                    onStateChange(item);
                    setStateOpen(false);
                  }}
                >
                  <Text style={[styles.stateText, state === item && styles.stateTextOn]}>
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 4,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: 16,
    marginBottom: 8,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkFaint,
    marginBottom: 8,
  },
  select: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  selectValue: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
  },
  selectPlaceholder: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.inkFaint,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipOn: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.inkMuted,
  },
  chipTextOn: {
    color: colors.paper,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(22, 48, 43, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '70%',
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  modalTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.ink,
  },
  modalClose: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.ochreDeep,
  },
  stateRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  stateRowOn: {
    backgroundColor: colors.paperDeep,
  },
  stateText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
  },
  stateTextOn: {
    fontFamily: fonts.bodyMedium,
    color: colors.ochreDeep,
  },
});
