import type { ResearchFormData } from "../types/research";

export const STORAGE_KEY = "researchmate-draft-v1";

export const emptyResearchForm: ResearchFormData = {
  topic: "",
  subjectArea: "",
  background: "",
  problemStatement: "",
  problemImportance: "",
  researchGap: "",
  mainQuestion: "",
  additionalQuestions: "",
  generalObjective: "",
  specificObjectives: "",
  approach: "",
  design: "",
  targetPopulation: "",
  sampleDescription: "",
  sampleSize: "",
  samplingMethod: "",
  dataCollection: "",
  dataAnalysis: "",
  ethics: "",
  duration: "",
  expectedOutcome: "",
};

export const sampleResearchForm: ResearchFormData = {
  topic:
    "The effect of social media usage on the study habits of Advanced Level students in a selected school",
  subjectArea: "Education and Media Studies",
  background:
    "Social media is part of many students' daily routines. Advanced Level students often use several platforms while preparing for demanding examinations, so teachers and families are interested in how this use relates to planning, concentration, and time spent studying.",
  problemStatement:
    "Some Advanced Level students in the selected school report checking social media during planned study periods. Teachers are concerned that frequent interruptions may reduce concentration and make it harder for students to follow regular study schedules, but the pattern has not been examined within this school.",
  problemImportance:
    "Understanding this issue could help students reflect on their routines and help teachers provide practical time-management guidance without assuming that all social media use is harmful.",
  researchGap:
    "Although general discussions about social media and learning are common, there is little school-level evidence describing usage patterns and study habits among Advanced Level students in this selected school.",
  mainQuestion:
    "What is the relationship between social media usage and the study habits of Advanced Level students in the selected school?",
  additionalQuestions:
    "How much time do students report spending on social media each day?\nWhich study-habit patterns are most common among the selected students?",
  generalObjective:
    "Examine the relationship between social media usage and the study habits of Advanced Level students in the selected school.",
  specificObjectives:
    "Identify the daily time students report spending on social media.\nDescribe the study-habit patterns of the selected students.\nUnderstand how social media use relates to students' study schedules.",
  approach: "quantitative",
  design: "Cross-sectional descriptive survey",
  targetPopulation:
    "All 320 Advanced Level students in Grades 12 and 13 at the selected school.",
  sampleDescription:
    "Advanced Level students selected from both grades and the main subject streams.",
  sampleSize: "80",
  samplingMethod: "Stratified random sampling by grade level",
  dataCollection:
    "A structured, self-administered questionnaire with multiple-choice items and short rating scales.",
  dataAnalysis:
    "Frequencies, percentages, and average scores will be used to summarise questionnaire responses.",
  ethics:
    "Participation will be voluntary. Students will receive clear information, consent will be requested, responses will be anonymous, and data will be stored securely. School permission and parent or guardian consent will be obtained where required.",
  duration: "Eight weeks",
  expectedOutcome:
    "A clear description of social media usage and study-habit patterns that can support student discussion and practical study-planning guidance.",
};

export const essentialFields: Array<keyof ResearchFormData> = [
  "topic",
  "problemStatement",
  "mainQuestion",
  "generalObjective",
  "approach",
  "dataCollection",
];

export const allProgressFields = Object.keys(
  emptyResearchForm,
) as Array<keyof ResearchFormData>;
