import { describe, expect, it } from "vitest";
import { emptyResearchForm, sampleResearchForm } from "../data/formData";
import type { ResearchFormData } from "../types/research";
import { analyzeResearch } from "./analysisEngine";

const completeBase: ResearchFormData = {
  ...emptyResearchForm,
  subjectArea: "Education",
  background:
    "Schools are working to support effective learning routines, but students have different experiences and study conditions that may influence their participation and progress.",
  problemImportance:
    "Better local evidence could help teachers plan practical support and help students make informed decisions about their learning routines.",
  researchGap:
    "There is limited local evidence and the pattern has not been studied with this specific group in the selected school.",
  additionalQuestions: "Which pattern is most common?\nHow does the pattern differ between groups?",
  specificObjectives: "Identify the main pattern.\nCompare the two student groups.\nEvaluate the relationship between the selected variables.",
  design: "Cross-sectional survey",
  targetPopulation: "All 280 Grade 11 students in the selected secondary school.",
  sampleDescription: "Grade 11 students selected from every class in the school.",
  sampleSize: "70",
  samplingMethod: "Stratified random sampling by class",
  ethics:
    "Participation will be voluntary, informed consent will be requested, answers will be anonymous, privacy will be protected, and school and parent permissions will be obtained where required.",
  duration: "Ten weeks",
  expectedOutcome:
    "A school-level description of the pattern and a cautious interpretation that can guide further discussion with students and teachers.",
};

describe("analyzeResearch", () => {
  it("treats a nearly empty proposal as an early idea", () => {
    const result = analyzeResearch(emptyResearchForm);
    expect(result.label).toBe("Early Idea");
    expect(result.score).toBeLessThan(45);
    expect(result.feedback.some((item) => item.type === "missing")).toBe(true);
    expect(result.alignment.every((item) => item.status === "insufficient")).toBe(true);
  });

  it("flags a vague and internally mismatched idea", () => {
    const vague: ResearchFormData = {
      ...emptyResearchForm,
      topic: "Things are bad",
      problemStatement: "Everything is a problem for people.",
      mainQuestion: "Why?",
      generalObjective: "Understand things",
      approach: "quantitative",
      dataCollection: "Open-ended interviews with a few volunteers",
    };
    const result = analyzeResearch(vague);
    expect(result.feedback.some((item) => item.title === "Topic uses vague wording")).toBe(true);
    expect(result.feedback.some((item) => item.type === "critical")).toBe(true);
    expect(result.score).toBeLessThan(60);
  });

  it("produces useful strengths and improvements for the bundled sample", () => {
    const result = analyzeResearch(sampleResearchForm);
    expect(result.strengths).toBeGreaterThan(8);
    expect(result.recommendations).toBeGreaterThan(0);
    expect(result.feedback.some((item) => item.title === "A specific objective uses a vague verb")).toBe(true);
    expect(result.feedback.some((item) => item.title === "Analysis may not test the stated relationship")).toBe(true);
  });

  it("recognises a coherent qualitative project", () => {
    const qualitative: ResearchFormData = {
      ...completeBase,
      topic: "Experiences of first-year teachers managing large classes in rural secondary schools",
      problemStatement:
        "First-year teachers in rural secondary schools often manage large classes with limited classroom resources. They may experience difficulty giving individual support, but their practical experiences and coping strategies are not clearly documented in this district.",
      mainQuestion: "How do first-year teachers describe their experiences of managing large classes in rural secondary schools?",
      generalObjective: "Explore first-year teachers' experiences of managing large classes in rural secondary schools.",
      specificObjectives: "Describe the main classroom challenges reported by first-year teachers.\nExplore the strategies teachers use to support learners.\nIdentify the support teachers believe would be useful.",
      approach: "qualitative",
      design: "Multiple case study",
      targetPopulation: "First-year teachers working in rural secondary schools in the selected district.",
      sampleDescription: "First-year teachers purposefully selected from four rural secondary schools.",
      sampleSize: "12",
      samplingMethod: "Purposive sampling",
      dataCollection: "Semi-structured interviews using open-ended questions and short field notes.",
      dataAnalysis: "The interview transcripts will be coded and interpreted using thematic analysis.",
    };
    const result = analyzeResearch(qualitative);
    expect(result.feedback.some((item) => item.title === "Approach matches the question")).toBe(true);
    expect(result.feedback.some((item) => item.title === "Data collection fits the approach")).toBe(true);
    expect(result.feedback.some((item) => item.title === "Data analysis fits the approach")).toBe(true);
  });

  it("scores a well-aligned quantitative project above the vague idea", () => {
    const quantitative: ResearchFormData = {
      ...completeBase,
      topic: "Relationship between sleep duration and classroom attention among Grade 11 students in Central College",
      problemStatement:
        "Grade 11 students at Central College report different sleep schedules, and teachers are concerned that limited sleep may be related to reduced classroom attention. The size and direction of this relationship are not known for this group.",
      mainQuestion: "What is the relationship between sleep duration and classroom attention among Grade 11 students at Central College?",
      generalObjective: "Determine the relationship between sleep duration and classroom attention among Grade 11 students at Central College.",
      specificObjectives: "Measure the reported sleep duration of Grade 11 students.\nDescribe student classroom-attention scores.\nAnalyze the relationship between sleep duration and attention scores.",
      approach: "quantitative",
      dataCollection: "A structured questionnaire and a short classroom-attention rating scale.",
      dataAnalysis: "Frequencies, percentages, mean scores, and a correlation analysis will be used.",
    };
    const vague = analyzeResearch({
      ...emptyResearchForm,
      topic: "Stuff and students",
      problemStatement: "Stuff is bad.",
      mainQuestion: "What is everything?",
      generalObjective: "Know everything",
      approach: "quantitative",
      dataCollection: "Interviews",
    });
    const strong = analyzeResearch(quantitative);
    expect(strong.score).toBeGreaterThan(vague.score);
    expect(strong.label).toBe("Strong Foundation");
    expect(strong.alignment.filter((item) => item.status === "strong").length).toBeGreaterThanOrEqual(4);
  });

  it("changes its feedback when the selected approach changes", () => {
    const project: ResearchFormData = {
      ...completeBase,
      topic: "Student experiences of peer feedback in a secondary school writing club",
      problemStatement:
        "Students in the school writing club receive regular peer feedback, but some report difficulty deciding which comments to use. Their experiences and reasons for accepting or rejecting feedback are not clearly understood.",
      mainQuestion: "How do students describe their experiences of using peer feedback in the school writing club?",
      generalObjective: "Explore students' experiences of using peer feedback in the school writing club.",
      dataCollection: "Semi-structured interviews with open-ended questions.",
      dataAnalysis: "Interview transcripts will be coded using thematic analysis.",
      approach: "qualitative",
    };
    const qualitative = analyzeResearch(project);
    const quantitative = analyzeResearch({ ...project, approach: "quantitative" });
    expect(qualitative.score).toBeGreaterThan(quantitative.score);
    expect(quantitative.feedback.some((item) => item.type === "critical")).toBe(true);
  });
});
