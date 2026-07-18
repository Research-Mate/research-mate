import { BookOpenCheck, FlaskConical, GraduationCap, ShieldCheck } from "lucide-react";
import type { AnalysisResult, FeedbackItem, ResearchFormData } from "../types/research";
import { AlignmentReview } from "./AlignmentReview";
import { FeedbackCard } from "./FeedbackCard";
import { ProposalChecklist } from "./ProposalChecklist";
import { ResultsSummary } from "./ResultsSummary";

interface ResultsDashboardProps {
  result: AnalysisResult;
  data: ResearchFormData;
  onReviewAgain: () => void;
}

function FeedbackGroup({
  title,
  eyebrow,
  items,
  emptyMessage,
}: {
  title: string;
  eyebrow: string;
  items: FeedbackItem[];
  emptyMessage: string;
}) {
  return (
    <section className="report-section feedback-group">
      <div className="report-section__heading">
        <div>
          <span className="report-section__eyebrow">{eyebrow}</span>
          <h3>{title}</h3>
        </div>
        <span className="report-section__count">{items.length}</span>
      </div>
      {items.length ? (
        <div className="feedback-list">
          {items.map((item) => (
            <FeedbackCard item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <div className="report-empty">
          <BookOpenCheck size={20} aria-hidden="true" />
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

export function ResultsDashboard({ result, data, onReviewAgain }: ResultsDashboardProps) {
  const strengths = result.feedback.filter((item) => item.type === "strength");
  const issues = result.feedback.filter((item) => item.type === "warning" || item.type === "critical");
  const suggestions = result.feedback.filter((item) => item.type === "improvement");
  const missing = result.feedback.filter((item) => item.type === "missing");
  const methodologyItems = result.feedback.filter(
    (item) => ["Methodology", "Participants & sampling", "Ethics"].includes(item.section) && item.type !== "strength",
  );

  return (
    <section className="results-dashboard" id="results" tabIndex={-1} aria-live="polite">
      <div className="site-shell">
        <ResultsSummary result={result} topic={data.topic} onReviewAgain={onReviewAgain} />

        <div className="results-layout">
          <div className="results-layout__main">
            <FeedbackGroup
              title="Strengths"
              eyebrow="What already works"
              items={strengths}
              emptyMessage="No strengths could be confirmed yet. Add more detail, then analyze again."
            />
            <FeedbackGroup
              title="Important issues"
              eyebrow="Review these first"
              items={issues}
              emptyMessage="No major mismatches or warnings were detected in the current draft."
            />
            <FeedbackGroup
              title="Suggestions for improvement"
              eyebrow="Practical refinements"
              items={suggestions}
              emptyMessage="No additional refinements were generated for the information provided."
            />
            <FeedbackGroup
              title="Missing information"
              eyebrow="What to add next"
              items={missing}
              emptyMessage="All checklist areas contain enough information for this automated review."
            />
          </div>

          <aside className="results-layout__aside">
            <section className="report-section methodology-snapshot">
              <div className="methodology-snapshot__icon">
                <FlaskConical size={21} aria-hidden="true" />
              </div>
              <span className="report-section__eyebrow">Methodology review</span>
              <h3>{data.approach ? `${data.approach[0].toUpperCase()}${data.approach.slice(1)} approach` : "Approach not selected"}</h3>
              <dl>
                <div>
                  <dt>Design</dt>
                  <dd>{data.design || "Not provided"}</dd>
                </div>
                <div>
                  <dt>Collection</dt>
                  <dd>{data.dataCollection || "Not provided"}</dd>
                </div>
                <div>
                  <dt>Analysis</dt>
                  <dd>{data.dataAnalysis || "Not provided"}</dd>
                </div>
              </dl>
              <div className="methodology-snapshot__note">
                {methodologyItems.length ? (
                  <>
                    <strong>{methodologyItems.length} methodology item{methodologyItems.length === 1 ? "" : "s"} to review.</strong>
                    <span>Use the detailed feedback cards before finalising this section.</span>
                  </>
                ) : (
                  <>
                    <strong>No methodology concerns detected.</strong>
                    <span>A teacher should still confirm the design and methods.</span>
                  </>
                )}
              </div>
            </section>

            <section className="integrity-card">
              <ShieldCheck size={22} aria-hidden="true" />
              <div>
                <span>Academic integrity reminder</span>
                <p>
                  ResearchMate provides educational guidance. It does not guarantee approval, replace a teacher or
                  supervisor, or write your complete research proposal.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <AlignmentReview alignment={result.alignment} />
        <ProposalChecklist items={result.checklist} />

        <section className="teacher-prompt no-print">
          <div className="teacher-prompt__icon">
            <GraduationCap size={23} aria-hidden="true" />
          </div>
          <div>
            <span>Your best next step</span>
            <h3>Take this report to a teacher or supervisor.</h3>
            <p>
              Ask them which two suggestions would most improve your idea. Academic methods and expectations differ
              by subject, school, and project level.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
