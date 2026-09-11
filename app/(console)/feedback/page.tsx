'use client';

import { FeedbackForm } from '@/components/FeedbackForm';
import { NoBuilding } from '@/components/NoBuilding';
import { useBuilding } from '@/providers/BuildingProvider';
import styles from './feedback.module.css';

export default function FeedbackPage() {
  const { building } = useBuilding();

  if (!building) return <NoBuilding />;

  return (
    <div className={styles.page}>
      <p className="kicker">Help us improve</p>
      <h1 className={styles.title}>Feedback</h1>
      <p className={styles.lead}>
        Bug, stuck on something, feature idea, or “this feels hectic” — tell us. It goes straight to the RunMyPG team.
      </p>
      <FeedbackForm appSource="web" />
    </div>
  );
}
