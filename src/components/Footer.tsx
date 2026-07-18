import { ShieldCheck } from "lucide-react";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return (
    <footer className="site-footer no-print" id="how-it-works">
      <div className="site-shell site-footer__grid">
        <div>
          <div className="site-footer__brand">
            <BrandMark compact />
            <span>ResearchMate</span>
          </div>
          <p>Constructive, private proposal guidance for student researchers.</p>
        </div>
        <div className="site-footer__principles">
          <ShieldCheck size={19} aria-hidden="true" />
          <p>
            Your draft stays in this browser. No proposal data is sent to an AI service or stored in a database.
          </p>
        </div>
        <p className="site-footer__copyright">© {new Date().getFullYear()} ResearchMate. Built for learning.</p>
      </div>
    </footer>
  );
}
