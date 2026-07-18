export type ResearchApproach = "" | "qualitative" | "quantitative" | "mixed";

export interface ResearchFormData {
  topic: string;
  subjectArea: string;
  background: string;
  problemStatement: string;
  problemImportance: string;
  researchGap: string;
  mainQuestion: string;
  additionalQuestions: string;
  generalObjective: string;
  specificObjectives: string;
  approach: ResearchApproach;
  design: string;
  targetPopulation: string;
  sampleDescription: string;
  sampleSize: string;
  samplingMethod: string;
  dataCollection: string;
  dataAnalysis: string;
  ethics: string;
  duration: string;
  expectedOutcome: string;
}

export type FeedbackType =
  | "strength"
  | "warning"
  | "improvement"
  | "missing"
  | "critical";

export interface FeedbackItem {
  id: string;
  type: FeedbackType;
  title: string;
  explanation: string;
  section: string;
  nextStep: string;
}

export type AlignmentStatus = "strong" | "partial" | "weak" | "insufficient";

export interface AlignmentResult {
  id: string;
  from: string;
  to: string;
  status: AlignmentStatus;
  explanation: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  complete: boolean;
  note: string;
}

export type ReadinessLabel =
  | "Early Idea"
  | "Developing"
  | "Almost Ready"
  | "Strong Foundation";

export interface AnalysisResult {
  score: number;
  label: ReadinessLabel;
  feedback: FeedbackItem[];
  alignment: AlignmentResult[];
  checklist: ChecklistItem[];
  strengths: number;
  issues: number;
  recommendations: number;
  generatedAt: string;
}

export type FormErrors = Partial<Record<keyof ResearchFormData, string>>;
