import { AlertTriangle, ArrowRight, CircleAlert, CircleCheck, Lightbulb, PlusCircle } from "lucide-react";
import type { FeedbackItem } from "../types/research";

const iconMap = {
  strength: CircleCheck,
  warning: AlertTriangle,
  improvement: Lightbulb,
  missing: PlusCircle,
  critical: CircleAlert,
};

const labelMap = {
  strength: "Strength",
  warning: "Warning",
  improvement: "Improvement",
  missing: "Missing",
  critical: "Critical mismatch",
};

export function FeedbackCard({ item }: { item: FeedbackItem }) {
  const Icon = iconMap[item.type];
  return (
    <article className={`feedback-card feedback-card--${item.type}`}>
      <div className="feedback-card__icon">
        <Icon size={19} aria-hidden="true" />
      </div>
      <div className="feedback-card__body">
        <div className="feedback-card__meta">
          <span>{labelMap[item.type]}</span>
          <span>{item.section}</span>
        </div>
        <h4>{item.title}</h4>
        <p>{item.explanation}</p>
        <div className="feedback-card__next">
          <ArrowRight size={15} aria-hidden="true" />
          <span>
            <strong>Next step:</strong> {item.nextStep}
          </span>
        </div>
      </div>
    </article>
  );
}
