import { Check, Circle, Printer } from "lucide-react";
import type { ChecklistItem } from "../types/research";

export function ProposalChecklist({ items }: { items: ChecklistItem[] }) {
  const complete = items.filter((item) => item.complete).length;
  return (
    <section className="report-section checklist-panel">
      <div className="report-section__heading">
        <div>
          <span className="report-section__eyebrow">Final check</span>
          <h3>Proposal checklist</h3>
        </div>
        <button className="button button--print no-print" type="button" onClick={() => window.print()}>
          <Printer size={17} aria-hidden="true" />
          Print / Save as PDF
        </button>
      </div>
      <div className="checklist-progress">
        <div>
          <strong>
            {complete} of {items.length}
          </strong>
          <span>proposal elements currently ready</span>
        </div>
        <div className="checklist-progress__track" aria-hidden="true">
          <span style={{ width: `${(complete / items.length) * 100}%` }} />
        </div>
      </div>
      <div className="checklist-list">
        {items.map((item) => (
          <div className={`checklist-item ${item.complete ? "is-complete" : ""}`} key={item.id}>
            <span className="checklist-item__icon">
              {item.complete ? <Check size={16} aria-hidden="true" /> : <Circle size={16} aria-hidden="true" />}
            </span>
            <div>
              <strong>{item.label}</strong>
              <p>{item.complete ? "Included in the current draft." : item.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
