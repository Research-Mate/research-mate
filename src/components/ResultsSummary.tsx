import { AlertCircle, CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import type { AnalysisResult } from "../types/research";

interface ResultsSummaryProps {
  result: AnalysisResult;
  topic: string;
  onReviewAgain: () => void;
}

export function ResultsSummary({ result, topic, onReviewAgain }: ResultsSummaryProps) {
  return (
    <section className="results-summary">
      <div className="print-only print-report-heading">
        <span>ResearchMate proposal-readiness report</span>
        <h1>{topic || "Untitled research idea"}</h1>
      </div>
      <div className="results-summary__top">
        <div>
          <span className="eyebrow eyebrow--light">Your automated guidance report</span>
          <h2>{result.label}</h2>
          <p>
            This score estimates completeness, clarity, and alignment from the text entered. It is guidance—not an
            academic judgment or approval decision.
          </p>
        </div>
        <button className="button button--summary no-print" type="button" onClick={onReviewAgain}>
          <RotateCcw size={16} aria-hidden="true" />
          Review my entries
        </button>
      </div>
      <div className="results-summary__grid">
        <div
          className="score-dial"
          style={{ "--score": `${result.score * 3.6}deg` } as React.CSSProperties}
          aria-label={`Overall readiness score ${result.score} out of 100`}
        >
          <div className="score-dial__inner">
            <strong>{result.score}</strong>
            <span>out of 100</span>
          </div>
        </div>
        <div className="results-summary__stats">
          <div className="summary-stat summary-stat--strength">
            <CheckCircle2 size={21} aria-hidden="true" />
            <strong>{result.strengths}</strong>
            <span>strengths</span>
          </div>
          <div className="summary-stat summary-stat--issue">
            <AlertCircle size={21} aria-hidden="true" />
            <strong>{result.issues}</strong>
            <span>issues to check</span>
          </div>
          <div className="summary-stat summary-stat--idea">
            <Lightbulb size={21} aria-hidden="true" />
            <strong>{result.recommendations}</strong>
            <span>next steps</span>
          </div>
        </div>
      </div>
    </section>
  );
}
