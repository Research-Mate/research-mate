# ResearchMate

ResearchMate is a polished, student-friendly web application that reviews the readiness and logical alignment of a research proposal idea. It helps secondary-school students and beginner researchers notice what is strong, unclear, missing, or inconsistent before they discuss a draft with a teacher or supervisor.

The MVP is fully local and rule-based. It does not require an account, database, paid API, or secret key.

## The problem ResearchMate solves

Beginner researchers often fill in proposal sections one at a time without seeing how the decisions connect. A topic may describe one group while the question refers to another; an objective may not answer the main question; or a data-collection method may not fit the chosen approach.

ResearchMate turns those connections into clear, constructive guidance. It does **not** write a complete proposal, fabricate evidence, guarantee approval, or replace human academic supervision.

## Target users

- Secondary-school students preparing their first research proposal
- Beginner researchers learning core methodology concepts
- Teachers demonstrating proposal alignment and readiness
- Education-focused competitions and classroom demos

## Features

- Five-part research input workflow covering basic information, the problem, research direction, methodology, and planning
- Clear essential-field validation without making every field mandatory
- Character counts, helper text, practical placeholders, and accessible labels
- Device-local draft saving through `localStorage`
- Visible completion progress and essential-field readiness
- Deterministic, input-specific analysis with no paid API
- Overall readiness score and four beginner-friendly readiness labels
- Structured strengths, warnings, improvements, missing details, and critical mismatches
- Six-link alignment review from topic through data analysis
- Methodology snapshot and academic-integrity guidance
- Fifteen-point final proposal checklist
- Complete sample project with intentional opportunities for improvement
- Print-friendly report and browser “Save as PDF” support
- Responsive layouts for mobile, tablet, desktop, and A4 printing
- Keyboard navigation, visible focus states, reduced-motion support, and an application error boundary

## Technology stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4 (with a tailored project design layer)
- Lucide React icons
- Vitest for deterministic analysis-engine tests

## How the analysis engine works

The analysis engine lives separately from the interface in `src/utils/analysisEngine.ts`. It receives a typed `ResearchFormData` object and returns a typed `AnalysisResult`.

Its deterministic checks include:

- topic length, vague wording, target group/context, and conclusion-like language
- problem detail, problem signals, affected group, importance, and background
- whether a research gap identifies missing knowledge instead of repeating the problem
- question form, focus, topic overlap, and broad wording
- action verbs, vague verbs, duplicate objectives, and question-objective overlap
- qualitative, quantitative, and mixed-methods question signals
- approach-to-collection and approach-to-analysis compatibility
- relationship/effect questions that may need more than descriptive statistics
- population, sample description, sample size, sampling method, and basic feasibility
- consent, voluntary participation, privacy, permissions, and safe data handling
- six pairwise alignment estimates based on content overlap and methodology rules

The readiness score combines:

1. Essential-field completeness
2. Supporting-section completeness
3. Quality deductions for warnings and mismatches
4. Alignment status across the six proposal connections

Every feedback item includes a section, explanation, type, and practical next step. The engine uses cautious wording because automated rules cannot make definitive academic judgments.

## Project structure

```text
src/
  components/       Reusable form, results, alignment, checklist, and layout UI
  data/             Empty and sample research data plus field configuration
  types/            Shared TypeScript domain types
  utils/            Deterministic analysis engine and scenario tests
  App.tsx            State, local persistence, validation, and workflow
  index.css          Responsive visual system and print styles
  main.tsx           React entry point and error boundary
```

## Current limitations

- The engine relies on transparent keyword, length, overlap, and compatibility rules; it does not understand meaning like a trained academic reviewer.
- It cannot validate subject-specific methodology conventions or school-specific requirements.
- Sample-size checks are broad feasibility reminders, not statistical sample-size calculations.
- It does not verify references, sources, originality, or factual claims.
- Drafts are stored only in the current browser on the current device. Clearing browser storage removes them.
- The readiness score is an educational estimate, not a grade or approval prediction.

## Future secure OpenAI API integration plan

If a language-model review is added later, it should use a secure backend or serverless function. The frontend must never contain an API key.

A safe extension could:

1. Validate and limit the submitted fields on the server.
2. Remove unnecessary personal data before processing.
3. Use the rule-engine output as structured context rather than replacing it.
4. Request explanations and questions for reflection—not a completed proposal.
5. Return schema-validated feedback with cautious academic wording.
6. Add rate limits, abuse protection, logging controls, and a clear retention policy.
7. Keep the deterministic local review available as a private, no-cost fallback.

## Academic-integrity principles

- Support the student’s reasoning rather than replace it.
- Do not generate fabricated sources, findings, statistics, or evidence.
- Do not claim that automated guidance guarantees academic quality or approval.
- Encourage teacher or supervisor review for methodology and ethics.
- Make limitations and automated-estimate language visible at the point of use.
- Keep proposal content private by default in this MVP.

- **Planning placeholder:** Describe which requirements, architecture decisions, or implementation checklist you personally reviewed with Codex.
- **Development placeholder:** Describe the components or rule-engine ideas Codex helped draft, and what you changed or approved yourself.
- **Testing placeholder:** Describe which test scenarios Codex helped run and how you personally checked the final behaviour.
- **Learning placeholder:** Describe one research-methodology, React, TypeScript, accessibility, or testing concept you learned during the build.
- **Human responsibility placeholder:** Explain that you reviewed the outputs, made final decisions, and take responsibility for the competition submission.

Keep this section specific and honest. Do not claim work you did not perform, and follow the competition’s rules for disclosing AI assistance.
