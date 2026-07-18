import { ArrowDown, Check, ShieldCheck, Sparkles } from "lucide-react";

interface HeroProps {
  onStart: () => void;
}

const alignmentSteps = [
  ["Topic", "Problem"],
  ["Problem", "Question"],
  ["Question", "Objectives"],
  ["Objectives", "Methodology"],
];

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="hero no-print" id="top">
      <div className="hero__wash" aria-hidden="true" />
      <div className="site-shell hero__grid">
        <div className="hero__content">
          <div className="eyebrow">
            <Sparkles size={15} aria-hidden="true" />
            A proposal-readiness companion for students
          </div>
          <h1>
            Turn your research idea into a <span>stronger proposal.</span>
          </h1>
          <p className="hero__lead">
            ResearchMate reviews how your topic, question, objectives, and methods connect—then gives you
            practical guidance in language that is easy to understand.
          </p>
          <div className="hero__actions">
            <button className="button button--primary button--large" type="button" onClick={onStart}>
              Start reviewing
              <ArrowDown size={18} aria-hidden="true" />
            </button>
            <span className="hero__free-note">
              <Check size={15} aria-hidden="true" />
              Free, private, and rule-based
            </span>
          </div>
          <div className="integrity-note integrity-note--hero">
            <ShieldCheck size={19} aria-hidden="true" />
            <p>
              <strong>Your thinking stays yours.</strong> ResearchMate guides your review; it does not write
              your full proposal or replace a teacher.
            </p>
          </div>
        </div>

        <div className="hero__visual" aria-label="Example research alignment map">
          <div className="hero-card__topline">
            <span>Proposal alignment map</span>
            <span className="hero-card__status">Live guidance</span>
          </div>
          <div className="hero-card__score-row">
            <div>
              <span className="hero-card__kicker">A stronger proposal</span>
              <strong>Connects every decision.</strong>
            </div>
            <div className="hero-card__mini-score">6 links</div>
          </div>
          <div className="hero-card__steps">
            {alignmentSteps.map(([from, to], index) => (
              <div className="hero-card__step" key={from}>
                <span className="hero-card__index">0{index + 1}</span>
                <span>{from}</span>
                <span className="hero-card__connector" aria-hidden="true" />
                <span>{to}</span>
                <Check className="hero-card__check" size={16} aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="hero-card__footer">
            <span className="hero-card__pulse" aria-hidden="true" />
            Specific feedback, based on what you enter
          </div>
        </div>
      </div>
    </section>
  );
}
