import type { ChangeEvent, FormEvent } from "react";
import {
  BookOpenText,
  BrainCircuit,
  CalendarRange,
  Eraser,
  FileInput,
  FlaskConical,
  LoaderCircle,
  SearchCheck,
  Target,
} from "lucide-react";
import type { FormErrors, ResearchFormData } from "../types/research";
import { FormField } from "./FormField";
import { FormSection } from "./FormSection";
import { ProgressIndicator } from "./ProgressIndicator";

interface ResearchFormProps {
  data: ResearchFormData;
  errors: FormErrors;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onLoadSample: () => void;
  onReset: () => void;
  isAnalyzing: boolean;
  progress: {
    percent: number;
    completed: number;
    total: number;
    essentialsComplete: number;
    essentialsTotal: number;
  };
  saved: boolean;
}

export function ResearchForm({
  data,
  errors,
  onChange,
  onSubmit,
  onLoadSample,
  onReset,
  isAnalyzing,
  progress,
  saved,
}: ResearchFormProps) {
  return (
    <section className="review-area no-print" id="review-form">
      <div className="site-shell">
        <div className="section-heading section-heading--form">
          <div>
            <span className="eyebrow eyebrow--plain">Proposal review workspace</span>
            <h2>Tell us about your research idea.</h2>
            <p>
              Start with the fields marked essential. More detail gives the review engine more evidence to work with,
              but you can return to your saved draft at any time.
            </p>
          </div>
          <div className="section-heading__legend">
            <span className="required-pill">Essential</span>
            Required for analysis
          </div>
        </div>

        <ProgressIndicator {...progress} saved={saved} />

        <form onSubmit={onSubmit} noValidate>
          <FormSection
            number="01"
            title="Basic information"
            description="Set the subject, group, and situation your study will examine."
            icon={<BookOpenText size={21} aria-hidden="true" />}
          >
            <FormField
              id="topic"
              name="topic"
              label="Research topic or title"
              value={data.topic}
              onChange={onChange}
              required
              error={errors.topic}
              helper="Aim for a focused title that includes the main subject and context."
              placeholder="e.g. The relationship between sleep duration and classroom attention among Grade 11 students"
              maxLength={180}
              className="form-field--full"
            />
            <FormField
              id="subjectArea"
              name="subjectArea"
              label="Subject area"
              value={data.subjectArea}
              onChange={onChange}
              helper="A broad school subject or area of study."
              placeholder="e.g. Education, Biology, Business Studies"
              maxLength={80}
            />
            <FormField
              id="background"
              name="background"
              label="Short background or context"
              value={data.background}
              onChange={onChange}
              kind="textarea"
              helper="Briefly explain the situation that led to this idea."
              placeholder="What is happening, and where does this topic fit?"
              maxLength={900}
              rows={5}
              className="form-field--full"
            />
          </FormSection>

          <FormSection
            number="02"
            title="Research problem"
            description="Explain the concern and the missing knowledge your study will address."
            icon={<SearchCheck size={21} aria-hidden="true" />}
          >
            <FormField
              id="problemStatement"
              name="problemStatement"
              label="Problem statement"
              value={data.problemStatement}
              onChange={onChange}
              kind="textarea"
              required
              error={errors.problemStatement}
              helper="Describe the actual problem, who is affected, and its context."
              placeholder="What specific issue is happening, for whom, and in what setting?"
              maxLength={1200}
              rows={6}
              className="form-field--full"
            />
            <FormField
              id="problemImportance"
              name="problemImportance"
              label="Why does this problem matter?"
              value={data.problemImportance}
              onChange={onChange}
              kind="textarea"
              helper="Explain who may benefit from better understanding."
              placeholder="Why is this worth studying?"
              maxLength={600}
              rows={4}
            />
            <FormField
              id="researchGap"
              name="researchGap"
              label="Research gap"
              value={data.researchGap}
              onChange={onChange}
              kind="textarea"
              helper="State what is unknown, missing, or insufficiently understood."
              placeholder="What local evidence or understanding is still missing?"
              maxLength={600}
              rows={4}
            />
          </FormSection>

          <FormSection
            number="03"
            title="Research direction"
            description="Turn the problem into one focused question and a set of clear actions."
            icon={<Target size={21} aria-hidden="true" />}
          >
            <FormField
              id="mainQuestion"
              name="mainQuestion"
              label="Main research question"
              value={data.mainQuestion}
              onChange={onChange}
              required
              error={errors.mainQuestion}
              helper="Write one question that your evidence can realistically answer."
              placeholder="e.g. How do Grade 11 students describe the barriers to regular reading?"
              maxLength={300}
              className="form-field--full"
            />
            <FormField
              id="additionalQuestions"
              name="additionalQuestions"
              label="Additional research questions"
              value={data.additionalQuestions}
              onChange={onChange}
              kind="textarea"
              helper="Optional. Add one supporting question per line."
              placeholder="Add only questions that support the main question."
              maxLength={700}
              rows={4}
            />
            <FormField
              id="generalObjective"
              name="generalObjective"
              label="General objective"
              value={data.generalObjective}
              onChange={onChange}
              required
              error={errors.generalObjective}
              helper="Begin with an action verb such as examine, explore, or evaluate."
              placeholder="e.g. Examine the relationship between..."
              maxLength={300}
            />
            <FormField
              id="specificObjectives"
              name="specificObjectives"
              label="Specific objectives"
              value={data.specificObjectives}
              onChange={onChange}
              kind="textarea"
              helper="Add one distinct, measurable objective per line."
              placeholder="Identify...\nCompare...\nDescribe..."
              maxLength={900}
              rows={6}
              className="form-field--full"
            />
          </FormSection>

          <FormSection
            number="04"
            title="Methodology"
            description="Show how you will collect trustworthy evidence to answer the question."
            icon={<FlaskConical size={21} aria-hidden="true" />}
          >
            <FormField
              id="approach"
              name="approach"
              label="Research approach"
              value={data.approach}
              onChange={onChange}
              kind="select"
              required
              error={errors.approach}
              helper="Choose based on whether you need words, numbers, or both."
            >
              <option value="">Select an approach</option>
              <option value="qualitative">Qualitative — experiences and meanings</option>
              <option value="quantitative">Quantitative — measurements and patterns</option>
              <option value="mixed">Mixed methods — words and numbers</option>
            </FormField>
            <FormField
              id="design"
              name="design"
              label="Research design"
              value={data.design}
              onChange={onChange}
              helper="Name the overall structure of the study."
              placeholder="e.g. Cross-sectional survey or case study"
              maxLength={140}
            />
            <FormField
              id="targetPopulation"
              name="targetPopulation"
              label="Target population"
              value={data.targetPopulation}
              onChange={onChange}
              helper="Describe the full group your study is about."
              placeholder="e.g. All 240 Grade 10 students at..."
              maxLength={300}
            />
            <FormField
              id="sampleDescription"
              name="sampleDescription"
              label="Sample description"
              value={data.sampleDescription}
              onChange={onChange}
              helper="Describe who will actually participate."
              placeholder="e.g. Students selected from all Grade 10 classes"
              maxLength={300}
            />
            <FormField
              id="sampleSize"
              name="sampleSize"
              label="Sample size"
              value={data.sampleSize}
              onChange={onChange}
              helper="Add the planned number of participants."
              placeholder="e.g. 60"
              maxLength={12}
              inputMode="numeric"
            />
            <FormField
              id="samplingMethod"
              name="samplingMethod"
              label="Sampling method"
              value={data.samplingMethod}
              onChange={onChange}
              helper="Explain how participants will be selected."
              placeholder="e.g. Stratified random sampling"
              maxLength={160}
            />
            <FormField
              id="dataCollection"
              name="dataCollection"
              label="Data-collection method"
              value={data.dataCollection}
              onChange={onChange}
              kind="textarea"
              required
              error={errors.dataCollection}
              helper="Name the tool and the type of information it will collect."
              placeholder="e.g. A structured questionnaire with rating-scale items"
              maxLength={650}
              rows={4}
            />
            <FormField
              id="dataAnalysis"
              name="dataAnalysis"
              label="Data-analysis method"
              value={data.dataAnalysis}
              onChange={onChange}
              kind="textarea"
              helper="Explain how the data will be organised and interpreted."
              placeholder="e.g. Frequencies and percentages, or thematic analysis"
              maxLength={650}
              rows={4}
            />
            <FormField
              id="ethics"
              name="ethics"
              label="Ethical considerations"
              value={data.ethics}
              onChange={onChange}
              kind="textarea"
              helper="Consider consent, privacy, choice, permissions, and safe data handling."
              placeholder="How will participants be informed and protected?"
              maxLength={850}
              rows={5}
              className="form-field--full"
            />
          </FormSection>

          <FormSection
            number="05"
            title="Planning"
            description="Check whether the project can be completed within a realistic scope."
            icon={<CalendarRange size={21} aria-hidden="true" />}
          >
            <FormField
              id="duration"
              name="duration"
              label="Estimated duration"
              value={data.duration}
              onChange={onChange}
              helper="Include time for permission, collection, analysis, and writing."
              placeholder="e.g. Eight weeks"
              maxLength={100}
            />
            <FormField
              id="expectedOutcome"
              name="expectedOutcome"
              label="Expected outcome"
              value={data.expectedOutcome}
              onChange={onChange}
              kind="textarea"
              helper="Describe the understanding you expect—not invented findings."
              placeholder="What useful knowledge should the study produce?"
              maxLength={600}
              rows={4}
            />
          </FormSection>

          <div className="form-actions">
            <div className="form-actions__secondary">
              <button className="button button--ghost" type="button" onClick={onLoadSample}>
                <FileInput size={17} aria-hidden="true" />
                Load sample
              </button>
              <button className="button button--subtle" type="button" onClick={onReset}>
                <Eraser size={17} aria-hidden="true" />
                Reset
              </button>
            </div>
            <button className="button button--primary button--analyze" type="submit" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <LoaderCircle className="spinner" size={19} aria-hidden="true" />
                  Reviewing connections…
                </>
              ) : (
                <>
                  <BrainCircuit size={19} aria-hidden="true" />
                  Analyze my proposal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
