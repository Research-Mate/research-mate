import { BookOpenCheck, FileInput } from "lucide-react";
import { BrandMark } from "./BrandMark";

interface HeaderProps {
  onLoadSample: () => void;
}

export function Header({ onLoadSample }: HeaderProps) {
  return (
    <header className="site-header no-print">
      <div className="site-shell site-header__inner">
        <a className="site-header__brand" href="#top" aria-label="ResearchMate home">
          <BrandMark compact />
          <span>ResearchMate</span>
        </a>
        <nav className="site-header__nav" aria-label="Primary navigation">
          <a href="#review-form">Review form</a>
          <a href="#how-it-works">How it works</a>
          <button className="button button--compact button--ghost" type="button" onClick={onLoadSample}>
            <FileInput size={16} aria-hidden="true" />
            Load sample
          </button>
        </nav>
        <a className="site-header__mobile-action" href="#review-form" aria-label="Go to review form">
          <BookOpenCheck size={19} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
