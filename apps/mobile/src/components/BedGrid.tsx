import { colors, radius } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import type { OccupancyCell } from '@/types/database';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  beds: OccupancyCell[];
  selectableEmpty?: boolean;
  selectedBedId?: string | null;
  onSelect?: (bed: OccupancyCell) => void;
};

export function BedGrid({ beds, selectableEmpty, selectedBedId, onSelect }: Props) {
  const rooms = groupByRoom(beds);

  return (
    <View style={styles.stack}>
      {rooms.map((room) => (
        <View key={room.name} style={styles.room}>
          <Text style={styles.roomName}>{room.name}</Text>
          <View style={styles.row}>
            {room.beds.map((bed) => {
              const occupied = bed.status === 'occupied';
              const selected = selectedBedId === bed.id;
              const canPress = Boolean(onSelect) && (!selectableEmpty || !occupied);
              return (
                <Pressable
                  key={bed.id}
                  disabled={!canPress}
                  onPress={() => onSelect?.(bed)}
                  style={[
                    styles.cell,
                    occupied ? styles.occupied : styles.empty,
                    selected && styles.selected,
                    selectableEmpty && occupied && styles.disabled,
                  ]}
                >
                  <Text style={[styles.bedLabel, occupied && styles.bedLabelOn]}>
                    {bed.label}
                  </Text>
                  {occupied && bed.tenant ? (
                    <Text numberOfLines={1} style={styles.tenant}>
                      {firstName(bed.tenant.full_name)}
                    </Text>
                  ) : (
                    <Text style={styles.emptyHint}>Empty</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

function groupByRoom(beds: OccupancyCell[]) {
  const order: string[] = [];
  const map = new Map<string, OccupancyCell[]>();
  for (const bed of beds) {
    if (!map.has(bed.room_name)) {
      order.push(bed.room_name);
      map.set(bed.room_name, []);
    }
    map.get(bed.room_name)!.push(bed);
  }
  return order.map((name) => ({ name, beds: map.get(name)! }));
}

const styles = StyleSheet.create({
  stack: {
    gap: 18,
  },
  room: {
    gap: 10,
  },
  roomName: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.inkMuted,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cell: {
    width: 76,
    minHeight: 72,
    borderRadius: radius.sm,
    padding: 8,
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  occupied: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  empty: {
    backgroundColor: colors.white,
    borderColor: colors.line,
  },
  selected: {
    borderColor: colors.ochre,
    borderWidth: 2,
    backgroundColor: colors.ochreSoft,
  },
  disabled: {
    opacity: 0.4,
  },
  bedLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.inkFaint,
  },
  bedLabelOn: {
    color: 'rgba(247, 245, 241, 0.7)',
  },
  tenant: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.paper,
  },
  emptyHint: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.inkFaint,
  },
});
