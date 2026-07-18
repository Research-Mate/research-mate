import type { ReactNode } from "react";

interface FormSectionProps {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export function FormSection({ number, title, description, icon, children }: FormSectionProps) {
  return (
    <section className="form-section">
      <div className="form-section__heading">
        <span className="form-section__icon">{icon}</span>
        <div>
          <span className="form-section__number">Section {number}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="form-section__fields">{children}</div>
    </section>
  );
}
