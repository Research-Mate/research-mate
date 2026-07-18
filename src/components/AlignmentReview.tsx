import { ArrowRight, Info } from "lucide-react";
import type { AlignmentResult, AlignmentStatus } from "../types/research";

const labels: Record<AlignmentStatus, string> = {
  strong: "Strong",
  partial: "Partial",
  weak: "Weak",
  insufficient: "Not enough information",
};

export function AlignmentReview({ alignment }: { alignment: AlignmentResult[] }) {
  return (
    <section className="report-section alignment-panel">
      <div className="report-section__heading">
        <div>
          <span className="report-section__eyebrow">Connection check</span>
          <h3>Alignment review</h3>
        </div>
        <div className="automated-note">
          <Info size={15} aria-hidden="true" />
          Automated guidance estimate
        </div>
      </div>
      <p className="report-section__intro">
        A proposal becomes easier to defend when each decision clearly leads to the next. Open each explanation with
        your teacher or supervisor in mind.
      </p>
      <div className="alignment-list">
        {alignment.map((item) => (
          <article className="alignment-row" key={item.id}>
            <div className="alignment-row__path">
              <span>{item.from}</span>
              <ArrowRight size={17} aria-hidden="true" />
              <span>{item.to}</span>
            </div>
            <span className={`alignment-badge alignment-badge--${item.status}`}>{labels[item.status]}</span>
            <p>{item.explanation}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
