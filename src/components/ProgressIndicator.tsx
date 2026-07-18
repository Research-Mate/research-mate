import { CheckCircle2, Circle, Save } from "lucide-react";

interface ProgressIndicatorProps {
  percent: number;
  completed: number;
  total: number;
  essentialsComplete: number;
  essentialsTotal: number;
  saved: boolean;
}

export function ProgressIndicator({
  percent,
  completed,
  total,
  essentialsComplete,
  essentialsTotal,
  saved,
}: ProgressIndicatorProps) {
  const essentialsReady = essentialsComplete === essentialsTotal;
  return (
    <aside className="progress-card" aria-label="Form completion progress">
      <div className="progress-card__header">
        <div>
          <span className="progress-card__eyebrow">Your progress</span>
          <strong>{percent}% complete</strong>
        </div>
        <span className="progress-card__count">
          {completed}/{total} fields
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`${percent}% of the research form completed`}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
      <div className="progress-card__details">
        <span className={essentialsReady ? "is-ready" : ""}>
          {essentialsReady ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          {essentialsComplete}/{essentialsTotal} essential fields ready
        </span>
        <span className={saved ? "is-saved" : ""}>
          <Save size={16} />
          {saved ? "Draft saved on this device" : "Local saving ready"}
        </span>
      </div>
    </aside>
  );
}
