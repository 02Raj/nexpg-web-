import type { OccupancyCell } from '@/types/database';
import styles from './bed-grid.module.css';

type Props = {
  beds: OccupancyCell[];
  selectableEmpty?: boolean;
  selectedBedId?: string | null;
  showRoomStats?: boolean;
  onSelect?: (bed: OccupancyCell) => void;
};

export function BedGrid({ beds, selectableEmpty, selectedBedId, showRoomStats, onSelect }: Props) {
  const rooms = groupByRoom(beds);

  return (
    <div className={styles.stack}>
      {rooms.map((room) => {
        const occupiedCount = room.beds.filter((b) => b.status === 'occupied').length;
        return (
        <div key={room.name} className={styles.room}>
          <div className={styles.roomHeader}>
            <div className={styles.roomName}>{room.name}</div>
            {showRoomStats ? (
              <span className={styles.roomMeta}>
                {occupiedCount}/{room.beds.length} filled
              </span>
            ) : null}
          </div>
          <div className={styles.row}>
            {room.beds.map((bed) => {
              const occupied = bed.status === 'occupied';
              const selected = selectedBedId === bed.id;
              const canPress = Boolean(onSelect) && (!selectableEmpty || !occupied);
              return (
                <button
                  key={bed.id}
                  type="button"
                  disabled={!canPress}
                  onClick={() => onSelect?.(bed)}
                  className={[
                    styles.cell,
                    occupied ? styles.occupied : styles.empty,
                    selected ? styles.selected : '',
                    selectableEmpty && occupied ? styles.disabled : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className={styles.bedLabel}>{bed.label}</span>
                  {occupied && bed.tenant ? (
                    <span className={styles.tenant}>{firstName(bed.tenant.full_name)}</span>
                  ) : (
                    <span className={styles.emptyHint}>Empty</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        );
      })}
    </div>
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
