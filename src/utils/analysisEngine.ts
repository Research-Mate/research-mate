import type {
  AlignmentResult,
  AlignmentStatus,
  AnalysisResult,
  ChecklistItem,
  FeedbackItem,
  ReadinessLabel,
  ResearchApproach,
  ResearchFormData,
} from "../types/research";
import { essentialFields } from "../data/formData";

const vagueWords = ["things", "stuff", "good", "bad", "everything"];
const audienceWords = [
  "student",
  "students",
  "teacher",
  "teachers",
  "adolescent",
  "adolescents",
  "youth",
  "children",
  "parents",
  "workers",
  "employees",
  "patients",
  "residents",
  "community",
  "school",
  "schools",
  "university",
  "college",
  "district",
  "village",
];
const problemSignals = [
  "problem",
  "challenge",
  "difficulty",
  "decline",
  "lack",
  "limited",
  "concern",
  "barrier",
  "risk",
  "affect",
  "struggle",
  "insufficient",
];
const gapSignals = [
  "unknown",
  "not known",
  "not studied",
  "little evidence",
  "limited evidence",
  "limited research",
  "insufficient evidence",
  "lack of evidence",
  "lack of data",
  "missing",
  "few studies",
  "has not been examined",
];
const strongVerbs = [
  "identify",
  "examine",
  "compare",
  "evaluate",
  "determine",
  "explore",
  "describe",
  "analyze",
  "analyse",
  "assess",
  "measure",
  "investigate",
  "estimate",
];
const vagueVerbs = ["know", "learn", "understand"];
const qualitativeSignals = [
  "experience",
  "experiences",
  "perception",
  "perceptions",
  "views",
  "meaning",
  "feel",
  "why",
  "how do",
  "challenges",
];
const quantitativeSignals = [
  "effect",
  "relationship",
  "association",
  "difference",
  "how many",
  "how much",
  "to what extent",
  "rate",
  "frequency",
  "predict",
  "influence",
];
const qualitativeCollection = [
  "interview",
  "focus group",
  "observation",
  "open-ended",
  "open ended",
  "field notes",
  "diary",
];
const quantitativeCollection = [
  "questionnaire",
  "survey",
  "test",
  "experiment",
  "scale",
  "measurement",
  "structured",
  "records",
];
const qualitativeAnalysis = [
  "thematic",
  "content analysis",
  "coding",
  "narrative",
  "themes",
  "framework analysis",
];
const quantitativeAnalysis = [
  "statistic",
  "frequency",
  "frequencies",
  "percentage",
  "percentages",
  "mean",
  "average",
  "correlation",
  "regression",
  "t-test",
  "anova",
  "chi-square",
  "spreadsheet",
];
const inferentialAnalysis = [
  "correlation",
  "regression",
  "t-test",
  "anova",
  "chi-square",
  "association",
  "inferential",
];
const stopWords = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "what",
  "how",
  "why",
  "does",
  "do",
  "among",
  "selected",
  "research",
  "study",
  "students",
]);

const clean = (value: string) => value.trim().toLowerCase();
const hasAny = (value: string, words: string[]) => {
  const normalized = clean(value);
  return words.some((word) => normalized.includes(word));
};
const wordCount = (value: string) =>
  value.trim() ? value.trim().split(/\s+/).length : 0;
const isFilled = (value: string, minimum = 1) => value.trim().length >= minimum;

function keywords(value: string): Set<string> {
  return new Set(
    clean(value)
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .map((word) => word.replace(/s$/, ""))
      .filter((word) => word.length > 3 && !stopWords.has(word)),
  );
}

function overlap(left: string, right: string): number {
  const leftWords = keywords(left);
  const rightWords = keywords(right);
  if (!leftWords.size || !rightWords.size) return 0;
  const shared = [...leftWords].filter((word) => rightWords.has(word)).length;
  return shared / Math.min(leftWords.size, rightWords.size);
}

function alignmentFromOverlap(
  left: string,
  right: string,
): { status: AlignmentStatus; explanation: string } {
  if (!isFilled(left) || !isFilled(right)) {
    return {
      status: "insufficient",
      explanation: "One or both elements need more information before this connection can be estimated.",
    };
  }
  const score = overlap(left, right);
  if (score >= 0.42) {
    return {
      status: "strong",
      explanation: "The two elements share a clear focus and key ideas.",
    };
  }
  if (score >= 0.2) {
    return {
      status: "partial",
      explanation: "Some key ideas connect, but the link could be stated more directly.",
    };
  }
  return {
    status: "weak",
    explanation: "The main ideas appear different or are not described specifically enough.",
  };
}

function questionApproachFit(
  question: string,
  approach: ResearchApproach,
): { status: AlignmentStatus; explanation: string } {
  if (!isFilled(question) || !approach) {
    return {
      status: "insufficient",
      explanation: "Add both a research question and an approach to estimate this fit.",
    };
  }
  const hasQualitative = hasAny(question, qualitativeSignals);
  const hasQuantitative = hasAny(question, quantitativeSignals);
  if (approach === "mixed") {
    if (hasQualitative && hasQuantitative) {
      return {
        status: "strong",
        explanation: "The question includes both measurable and experience-based directions.",
      };
    }
    return {
      status: "partial",
      explanation: "A mixed-methods study usually needs both a measurable and an experience-based part.",
    };
  }
  if (approach === "qualitative") {
    if (hasQualitative && !hasQuantitative) {
      return {
        status: "strong",
        explanation: "The question invites detailed descriptions, views, or experiences.",
      };
    }
    if (hasQualitative) {
      return {
        status: "partial",
        explanation: "The question has a qualitative direction but also suggests measurement.",
      };
    }
    return {
      status: "weak",
      explanation: "The question sounds mainly numerical for a qualitative approach.",
    };
  }
  if (hasQuantitative && !hasQualitative) {
    return {
      status: "strong",
      explanation: "The question focuses on a measurable effect, relationship, or amount.",
    };
  }
  if (hasQuantitative) {
    return {
      status: "partial",
      explanation: "The question has a measurable direction but may also require detailed experiences.",
    };
  }
  return {
    status: "weak",
    explanation: "The question does not yet make the planned numerical measurement clear.",
  };
}

function collectionFit(
  collection: string,
  approach: ResearchApproach,
): { status: AlignmentStatus; explanation: string } {
  if (!isFilled(collection) || !approach) {
    return {
      status: "insufficient",
      explanation: "Select an approach and describe how data will be collected.",
    };
  }
  const qualitative = hasAny(collection, qualitativeCollection);
  const quantitative = hasAny(collection, quantitativeCollection);
  if (approach === "mixed") {
    if (qualitative && quantitative) {
      return {
        status: "strong",
        explanation: "Both qualitative and quantitative data-collection methods are included.",
      };
    }
    return {
      status: "partial",
      explanation: "Only one type of data collection is clear for the mixed-methods approach.",
    };
  }
  const matches = approach === "qualitative" ? qualitative : quantitative;
  const conflicts = approach === "qualitative" ? quantitative && !qualitative : qualitative && !quantitative;
  if (matches) {
    return {
      status: "strong",
      explanation: `The proposed method can produce ${approach} data.`,
    };
  }
  if (conflicts) {
    return {
      status: "weak",
      explanation: `The stated method appears better suited to a different research approach.`,
    };
  }
  return {
    status: "partial",
    explanation: "The method may fit, but explain its format and the kind of data it will produce.",
  };
}

function analysisFit(
  analysis: string,
  approach: ResearchApproach,
): { status: AlignmentStatus; explanation: string } {
  if (!isFilled(analysis) || !approach) {
    return {
      status: "insufficient",
      explanation: "Add a data-analysis method to check how the collected data will be handled.",
    };
  }
  const qualitative = hasAny(analysis, qualitativeAnalysis);
  const quantitative = hasAny(analysis, quantitativeAnalysis);
  if (approach === "mixed") {
    if (qualitative && quantitative) {
      return {
        status: "strong",
        explanation: "The plan explains how both text-based and numerical data will be analysed.",
      };
    }
    return {
      status: "partial",
      explanation: "The analysis plan covers only one part of the mixed-methods data.",
    };
  }
  const matches = approach === "qualitative" ? qualitative : quantitative;
  const conflicts = approach === "qualitative" ? quantitative && !qualitative : qualitative && !quantitative;
  if (matches) {
    return {
      status: "strong",
      explanation: `The analysis method fits the expected ${approach} data.`,
    };
  }
  if (conflicts) {
    return {
      status: "weak",
      explanation: "The analysis method appears designed for a different type of data.",
    };
  }
  return {
    status: "partial",
    explanation: "Name the exact analysis technique so the fit can be judged more clearly.",
  };
}

function splitObjectives(value: string): string[] {
  return value
    .split(/\n|;/)
    .map((item) => item.replace(/^[-•\d.)\s]+/, "").trim())
    .filter(Boolean);
}

function readinessLabel(score: number): ReadinessLabel {
  if (score < 45) return "Early Idea";
  if (score < 65) return "Developing";
  if (score < 82) return "Almost Ready";
  return "Strong Foundation";
}

function checklist(
  data: ResearchFormData,
  methodFit: AlignmentStatus,
): ChecklistItem[] {
  const topicWords = wordCount(data.topic);
  const objectives = splitObjectives(data.specificObjectives);
  const item = (id: string, label: string, complete: boolean, note: string) => ({
    id,
    label,
    complete,
    note,
  });
  return [
    item("title", "Clear research title", topicWords >= 5 && !hasAny(data.topic, vagueWords), "Use a focused title with the subject, group, or context."),
    item("background", "Background / context", isFilled(data.background, 60), "Explain the situation surrounding the study."),
    item("problem", "Defined problem", isFilled(data.problemStatement, 80), "Describe the real issue, context, and people affected."),
    item("gap", "Research gap", hasAny(data.researchGap, gapSignals), "State what evidence or understanding is still missing."),
    item("question", "Main research question", data.mainQuestion.trim().endsWith("?") && wordCount(data.mainQuestion) >= 7, "Use one focused, answerable question."),
    item("general-objective", "General objective", hasAny(clean(data.generalObjective).split(/\s+/)[0] ?? "", strongVerbs), "Begin with a clear action verb."),
    item("specific-objectives", "Specific objectives", objectives.length >= 2, "Include at least two distinct, practical objectives."),
    item("methodology", "Suitable methodology", Boolean(data.approach) && methodFit !== "weak" && methodFit !== "insufficient", "Match the approach to the question and planned data."),
    item("participants", "Population and sample", isFilled(data.targetPopulation, 20) && isFilled(data.sampleDescription, 15) && isFilled(data.sampleSize), "Identify the full population and the selected sample."),
    item("sampling", "Sampling method", isFilled(data.samplingMethod, 5), "Name how participants will be selected."),
    item("collection", "Data-collection method", isFilled(data.dataCollection, 10), "Name the tool and the type of information it collects."),
    item("analysis", "Data-analysis method", isFilled(data.dataAnalysis, 10), "Explain how the collected information will be analysed."),
    item("ethics", "Ethical considerations", isFilled(data.ethics, 50), "Cover consent, privacy, voluntary participation, and permissions."),
    item("timeline", "Timeline", isFilled(data.duration), "Estimate a realistic duration or set of stages."),
    item("outcome", "Expected outcome", isFilled(data.expectedOutcome, 30), "Describe what useful understanding the study should produce."),
  ];
}

export function analyzeResearch(data: ResearchFormData): AnalysisResult {
  const feedback: FeedbackItem[] = [];
  let feedbackId = 0;
  const add = (item: Omit<FeedbackItem, "id">) => {
    feedbackId += 1;
    feedback.push({ ...item, id: `feedback-${feedbackId}` });
  };

  const topicWords = wordCount(data.topic);
  if (!data.topic.trim()) {
    add({ type: "missing", title: "Research topic is missing", explanation: "A topic gives the rest of the proposal a clear direction.", section: "Topic", nextStep: "Write a short title that names the subject, group, and setting where possible." });
  } else {
    if (topicWords < 5) {
      add({ type: "improvement", title: "Topic is very short", explanation: "A very short title may not show exactly what or who will be studied.", section: "Topic", nextStep: "Add the main subject and a target group or context." });
    } else if (topicWords > 24) {
      add({ type: "improvement", title: "Topic may be too long", explanation: "The title contains many words and may be trying to cover several ideas at once.", section: "Topic", nextStep: "Keep the central relationship, group, and setting; remove background details." });
    } else {
      add({ type: "strength", title: "Topic has a workable level of detail", explanation: "The title is long enough to communicate a clear starting direction.", section: "Topic", nextStep: "Keep the same focus throughout the problem, question, and objectives." });
    }
    const vague = vagueWords.filter((word) => clean(data.topic).includes(word));
    if (vague.length) {
      add({ type: "warning", title: "Topic uses vague wording", explanation: `Words such as “${vague.join(", ")}” can mean different things to different readers.`, section: "Topic", nextStep: "Replace vague words with an observable behaviour, condition, or outcome." });
    }
    if (hasAny(data.topic, audienceWords) || /\b(in|among|at)\b/i.test(data.topic)) {
      add({ type: "strength", title: "Target group or context is visible", explanation: "The title gives the reader a clue about where or with whom the study will happen.", section: "Topic", nextStep: "Use the same group and setting in the population and sample sections." });
    } else {
      add({ type: "improvement", title: "Topic needs a clearer context", explanation: "The title does not clearly show the group, place, or situation being studied.", section: "Topic", nextStep: "Add a defined target group or a realistic setting." });
    }
    if (/\b(is|are)\s+(good|bad|best|worst)\b/i.test(data.topic)) {
      add({ type: "warning", title: "Topic sounds like a conclusion", explanation: "A research title should not decide the answer before evidence is collected.", section: "Topic", nextStep: "Reframe it around an effect, relationship, experience, pattern, or comparison." });
    }
  }

  if (isFilled(data.background, 60)) {
    add({ type: "strength", title: "Background gives useful context", explanation: "The study is introduced in a way that helps a beginner understand the situation.", section: "Research problem", nextStep: "Keep only context that directly supports the problem." });
  } else {
    add({ type: "missing", title: "Background needs more context", explanation: "The proposal does not yet explain the situation leading to the problem.", section: "Research problem", nextStep: "Add a short explanation of where the issue occurs and what is already happening." });
  }

  if (!isFilled(data.problemStatement)) {
    add({ type: "missing", title: "Problem statement is missing", explanation: "The reader cannot tell what real issue the study is trying to understand.", section: "Research problem", nextStep: "Describe the current problem, who experiences it, and its setting." });
  } else {
    if (wordCount(data.problemStatement) < 35) {
      add({ type: "warning", title: "Problem statement is too brief", explanation: "The statement may name a topic without explaining the actual issue and its context.", section: "Research problem", nextStep: "Explain what is happening, who is affected, and why the situation deserves study." });
    } else {
      add({ type: "strength", title: "Problem is explained with detail", explanation: "The statement provides enough information to identify a real situation for study.", section: "Research problem", nextStep: "Check that every detail leads directly to the research question." });
    }
    if (!hasAny(data.problemStatement, problemSignals)) {
      add({ type: "improvement", title: "Actual problem is not explicit", explanation: "The text provides context, but the difficulty, concern, or unmet need is hard to locate.", section: "Research problem", nextStep: "Use one direct sentence to state the specific problem." });
    }
    if (!hasAny(data.problemStatement, audienceWords) && !hasAny(data.targetPopulation, audienceWords)) {
      add({ type: "improvement", title: "People affected are unclear", explanation: "The problem does not clearly identify who experiences or is influenced by it.", section: "Research problem", nextStep: "Name the group affected and keep that group consistent with the population." });
    }
  }

  if (isFilled(data.problemImportance, 40)) {
    add({ type: "strength", title: "Importance of the problem is explained", explanation: "The proposal gives a reason why answering the question could be useful.", section: "Research problem", nextStep: "Avoid promising results that the planned study cannot demonstrate." });
  } else {
    add({ type: "missing", title: "Why the problem matters is unclear", explanation: "The proposal needs a simple reason showing why this problem deserves attention.", section: "Research problem", nextStep: "Explain who could benefit from better understanding and how." });
  }

  if (!isFilled(data.researchGap)) {
    add({ type: "missing", title: "Research gap is missing", explanation: "A gap explains what is not yet known, not only what is going wrong.", section: "Research gap", nextStep: "State what information, local evidence, comparison, or understanding is currently missing." });
  } else if (hasAny(data.researchGap, gapSignals)) {
    add({ type: "strength", title: "Research gap identifies missing knowledge", explanation: "The gap points to information or evidence that the proposed study could reasonably add.", section: "Research gap", nextStep: "Make sure the research question is written to address this exact gap." });
  } else {
    add({ type: "warning", title: "Gap may repeat the general problem", explanation: "The text describes an issue but does not clearly say what is unknown or insufficiently understood.", section: "Research gap", nextStep: "Add a sentence beginning with what is not known, not studied, or lacking in the chosen context." });
  }

  const topicQuestionOverlap = overlap(data.topic, data.mainQuestion);
  if (!isFilled(data.mainQuestion)) {
    add({ type: "missing", title: "Main research question is missing", explanation: "The study needs one central question that the evidence will answer.", section: "Research question", nextStep: "Write a focused question using the same subject and group as the topic." });
  } else {
    if (!data.mainQuestion.trim().endsWith("?")) {
      add({ type: "warning", title: "Main question is not written as a question", explanation: "The wording currently reads like a statement or objective.", section: "Research question", nextStep: "Rewrite it as one direct question and end it with a question mark." });
    }
    if (wordCount(data.mainQuestion) < 7) {
      add({ type: "improvement", title: "Research question is too broad", explanation: "The question is too short to show the key subject, group, or context.", section: "Research question", nextStep: "Name what will be examined and for whom or where." });
    } else if (wordCount(data.mainQuestion) > 28 || /\b(everything|all aspects|all people)\b/i.test(data.mainQuestion)) {
      add({ type: "warning", title: "Research question may cover too much", explanation: "A broad question is difficult to answer well within a school-level project.", section: "Research question", nextStep: "Limit the question to one relationship, experience, pattern, or comparison." });
    } else {
      add({ type: "strength", title: "Research question is focused", explanation: "The main question has enough detail for a practical investigation.", section: "Research question", nextStep: "Use its key ideas when writing every objective." });
    }
    if (topicQuestionOverlap >= 0.2) {
      add({ type: "strength", title: "Question connects to the topic", explanation: "Important ideas from the title also appear in the research question.", section: "Research question", nextStep: "Keep the same wording for the main concepts where possible." });
    } else {
      add({ type: "critical", title: "Question and topic appear disconnected", explanation: "The key ideas in the main question do not clearly match the title.", section: "Research question", nextStep: "Choose one main focus and repeat its central terms in both the title and question." });
    }
  }

  const approachFit = questionApproachFit(data.mainQuestion, data.approach);
  if (!data.approach) {
    add({ type: "missing", title: "Research approach is missing", explanation: "The approach determines the type of evidence the project will collect.", section: "Methodology", nextStep: "Choose qualitative, quantitative, or mixed methods based on the main question." });
  } else if (approachFit.status === "strong") {
    add({ type: "strength", title: "Approach matches the question", explanation: approachFit.explanation, section: "Methodology", nextStep: "Keep the data-collection and analysis methods consistent with this approach." });
  } else if (approachFit.status === "weak") {
    add({ type: "critical", title: "Approach may not answer the question", explanation: approachFit.explanation, section: "Methodology", nextStep: "Either revise the question or choose an approach that produces the required kind of evidence." });
  } else if (approachFit.status === "partial") {
    add({ type: "warning", title: "Approach only partly matches the question", explanation: approachFit.explanation, section: "Methodology", nextStep: "Clarify whether the study needs numerical patterns, detailed experiences, or both." });
  }

  const firstGeneralVerb = clean(data.generalObjective).split(/\s+/)[0] ?? "";
  if (!isFilled(data.generalObjective)) {
    add({ type: "missing", title: "General objective is missing", explanation: "The objective should state the main action the study will take.", section: "Objectives", nextStep: "Begin with a strong verb such as examine, explore, determine, or evaluate." });
  } else if (vagueVerbs.includes(firstGeneralVerb)) {
    add({ type: "warning", title: "General objective uses a vague verb", explanation: `“${firstGeneralVerb}” is difficult to observe or measure clearly.`, section: "Objectives", nextStep: "Replace it with identify, examine, compare, evaluate, determine, explore, describe, or analyse." });
  } else if (strongVerbs.includes(firstGeneralVerb)) {
    add({ type: "strength", title: "General objective starts with an action verb", explanation: `“${firstGeneralVerb}” gives the study a clear action.`, section: "Objectives", nextStep: "Keep the objective achievable within the proposed duration." });
  } else {
    add({ type: "improvement", title: "General objective needs a clearer action", explanation: "The first word does not clearly show what the research will do.", section: "Objectives", nextStep: "Start with identify, examine, compare, evaluate, determine, explore, describe, or analyse." });
  }

  if (isFilled(data.generalObjective) && overlap(data.mainQuestion, data.generalObjective) >= 0.2) {
    add({ type: "strength", title: "General objective follows the question", explanation: "The objective repeats the main focus of the research question.", section: "Objectives", nextStep: "Use specific objectives to break this action into smaller steps." });
  } else if (isFilled(data.generalObjective) && isFilled(data.mainQuestion)) {
    add({ type: "warning", title: "Objective may drift from the question", explanation: "The objective and question do not share enough central ideas.", section: "Objectives", nextStep: "Rewrite the objective as the action needed to answer the main question." });
  }

  const objectives = splitObjectives(data.specificObjectives);
  if (!objectives.length) {
    add({ type: "missing", title: "Specific objectives are missing", explanation: "Specific objectives turn the main aim into manageable research tasks.", section: "Objectives", nextStep: "Add two to four distinct objectives, one per line." });
  } else {
    if (objectives.length >= 2) {
      add({ type: "strength", title: "Study has multiple specific objectives", explanation: "The project is broken into smaller actions that can guide data collection.", section: "Objectives", nextStep: "Check that each objective needs a distinct piece of evidence." });
    } else {
      add({ type: "improvement", title: "Only one specific objective is listed", explanation: "One objective may not show all the practical steps needed to answer the question.", section: "Objectives", nextStep: "Add another distinct and measurable objective if the study genuinely needs it." });
    }
    const normalized = objectives.map((objective) => clean(objective).replace(/[^a-z0-9\s]/g, ""));
    if (new Set(normalized).size !== normalized.length) {
      add({ type: "warning", title: "Specific objectives are duplicated", explanation: "At least two objectives repeat the same action and focus.", section: "Objectives", nextStep: "Combine duplicates or give each objective a different role." });
    }
    const vagueObjective = objectives.find((objective) => vagueVerbs.includes(clean(objective).split(/\s+/)[0] ?? ""));
    if (vagueObjective) {
      add({ type: "improvement", title: "A specific objective uses a vague verb", explanation: "Verbs such as know, learn, and understand are difficult to check with evidence.", section: "Objectives", nextStep: "Use identify, describe, compare, measure, evaluate, explore, or analyse." });
    }
    const unclearAction = objectives.find((objective) => {
      const first = clean(objective).split(/\s+/)[0] ?? "";
      return !strongVerbs.includes(first) && !vagueVerbs.includes(first);
    });
    if (unclearAction) {
      add({ type: "improvement", title: "One objective needs a measurable action", explanation: "At least one objective does not begin with a clear research action.", section: "Objectives", nextStep: "Start every objective with a specific action verb." });
    }
  }

  const collectionMatch = collectionFit(data.dataCollection, data.approach);
  if (!isFilled(data.dataCollection)) {
    add({ type: "missing", title: "Data-collection method is missing", explanation: "The proposal does not explain how evidence will be gathered.", section: "Methodology", nextStep: "Name a method that can produce the type of data needed to answer the question." });
  } else if (collectionMatch.status === "strong") {
    add({ type: "strength", title: "Data collection fits the approach", explanation: collectionMatch.explanation, section: "Methodology", nextStep: "Describe the tool, participants, and how it will be administered." });
  } else if (collectionMatch.status === "weak") {
    add({ type: "critical", title: "Data collection conflicts with the approach", explanation: collectionMatch.explanation, section: "Methodology", nextStep: "Choose a method that produces the kind of evidence required by the selected approach." });
  } else if (collectionMatch.status === "partial") {
    add({ type: "improvement", title: "Data collection needs more detail", explanation: collectionMatch.explanation, section: "Methodology", nextStep: "Name the exact tool and whether it produces words, numbers, or both." });
  }

  const analysisMatch = analysisFit(data.dataAnalysis, data.approach);
  if (!isFilled(data.dataAnalysis)) {
    add({ type: "missing", title: "Data-analysis method is missing", explanation: "The proposal explains how data may be collected but not how it will answer the question.", section: "Methodology", nextStep: "Name an analysis method that fits the expected data." });
  } else if (analysisMatch.status === "strong") {
    add({ type: "strength", title: "Data analysis fits the approach", explanation: analysisMatch.explanation, section: "Methodology", nextStep: "Link each analysis technique to a research question or objective." });
  } else if (analysisMatch.status === "weak") {
    add({ type: "critical", title: "Data analysis conflicts with the data type", explanation: analysisMatch.explanation, section: "Methodology", nextStep: "Use thematic or coding methods for text, and suitable statistical methods for numbers." });
  } else if (analysisMatch.status === "partial") {
    add({ type: "improvement", title: "Analysis plan is not specific enough", explanation: analysisMatch.explanation, section: "Methodology", nextStep: "Name the exact technique, such as thematic analysis, percentages, comparison, or correlation." });
  }
  if (
    data.approach === "quantitative" &&
    hasAny(data.mainQuestion, ["effect", "relationship", "association", "influence"]) &&
    isFilled(data.dataAnalysis) &&
    !hasAny(data.dataAnalysis, inferentialAnalysis)
  ) {
    add({ type: "warning", title: "Analysis may not test the stated relationship", explanation: "Descriptive summaries can show patterns, but they may not directly examine an effect or relationship.", section: "Methodology", nextStep: "Ask a supervisor whether a suitable comparison, correlation, or other relational analysis is needed." });
  }

  if (isFilled(data.design, 5)) {
    add({ type: "strength", title: "Research design is named", explanation: "The proposal gives the overall structure planned for the study.", section: "Methodology", nextStep: "Check with a teacher that the design name is used correctly in your subject area." });
  } else {
    add({ type: "missing", title: "Research design is not named", explanation: "The approach is selected, but the study structure is still unclear.", section: "Methodology", nextStep: "Consider a suitable design such as a survey, case study, experiment, or phenomenological study." });
  }

  if (isFilled(data.targetPopulation, 20)) {
    add({ type: "strength", title: "Target population is described", explanation: "The proposal identifies the larger group the study concerns.", section: "Participants & sampling", nextStep: "Make sure the sample is drawn from this same group." });
  } else {
    add({ type: "missing", title: "Target population needs definition", explanation: "It is not clear which full group the research is about.", section: "Participants & sampling", nextStep: "Name the group, location, and any important inclusion limits." });
  }
  if (!isFilled(data.sampleDescription, 15)) {
    add({ type: "missing", title: "Sample is not explained", explanation: "The proposal does not describe who will actually take part.", section: "Participants & sampling", nextStep: "Describe the selected participants and how they represent the target population." });
  }
  if (!isFilled(data.sampleSize)) {
    add({ type: "missing", title: "Sample size is missing", explanation: "The number of expected participants is needed for feasibility planning.", section: "Participants & sampling", nextStep: "Add a realistic number and confirm it with a teacher or supervisor." });
  } else {
    const size = Number(data.sampleSize.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(size) || size <= 0) {
      add({ type: "warning", title: "Sample size is unclear", explanation: "The entry does not contain a usable participant number.", section: "Participants & sampling", nextStep: "Enter the planned number of participants as a positive number." });
    } else if ((data.approach === "quantitative" && size < 15) || (data.approach === "mixed" && size < 20)) {
      add({ type: "warning", title: "Sample may be too small for the approach", explanation: "A very small numerical sample may not support the comparisons or patterns the question expects.", section: "Participants & sampling", nextStep: "Ask a supervisor to check the sample-size reasoning and project feasibility." });
    } else if (data.approach === "qualitative" && size > 100) {
      add({ type: "warning", title: "Qualitative sample may be unrealistic", explanation: "Detailed qualitative data from this many participants could be difficult to collect and analyse well.", section: "Participants & sampling", nextStep: "Consider a smaller purposeful sample and justify why it can answer the question." });
    } else {
      add({ type: "strength", title: "Sample size is stated", explanation: "The proposal includes a concrete number for feasibility planning.", section: "Participants & sampling", nextStep: "Add a brief justification with guidance from a teacher or supervisor." });
    }
  }
  if (isFilled(data.samplingMethod, 5)) {
    add({ type: "strength", title: "Sampling method is included", explanation: "The proposal names how participants will be chosen.", section: "Participants & sampling", nextStep: "Explain why this method is practical and fair for the target population." });
  } else {
    add({ type: "missing", title: "Sampling method is missing", explanation: "The reader cannot tell how participants will be selected.", section: "Participants & sampling", nextStep: "Name a suitable method such as random, stratified, purposive, convenience, or total-population sampling." });
  }

  if (!isFilled(data.ethics, 50)) {
    add({ type: "missing", title: "Ethical considerations need attention", explanation: "A student project should explain how participants will be respected and protected.", section: "Ethics", nextStep: "Cover informed consent, voluntary participation, privacy, permissions, and secure handling of data." });
  } else if (hasAny(data.ethics, ["consent", "voluntary"]) && hasAny(data.ethics, ["privacy", "anonymous", "confidential"])) {
    add({ type: "strength", title: "Core ethical protections are included", explanation: "The plan recognises consent, choice, and protection of participant information.", section: "Ethics", nextStep: "Confirm school and parent or guardian requirements before collecting any data." });
  } else {
    add({ type: "improvement", title: "Ethics section is incomplete", explanation: "Ethics are mentioned, but consent, voluntary participation, or privacy is not yet clear.", section: "Ethics", nextStep: "State how consent, withdrawal, confidentiality, and permissions will be handled." });
  }

  if (isFilled(data.duration) && isFilled(data.expectedOutcome, 30)) {
    add({ type: "strength", title: "Basic planning information is present", explanation: "The proposal includes a duration and a realistic intended outcome.", section: "Planning", nextStep: "Break the duration into approval, collection, analysis, and writing stages." });
  } else {
    add({ type: "improvement", title: "Planning details are incomplete", explanation: "A timeline and expected outcome help show that the project is practical.", section: "Planning", nextStep: "Add a realistic duration and describe the understanding the study should produce." });
  }

  const objectivesText = `${data.generalObjective} ${data.specificObjectives}`;
  const topicProblem = alignmentFromOverlap(data.topic, `${data.background} ${data.problemStatement}`);
  const problemQuestion = alignmentFromOverlap(data.problemStatement, data.mainQuestion);
  const questionObjectives = alignmentFromOverlap(data.mainQuestion, objectivesText);
  const collectionAnalysis = !isFilled(data.dataCollection) || !isFilled(data.dataAnalysis)
    ? { status: "insufficient" as AlignmentStatus, explanation: "Both collection and analysis methods are needed to estimate this connection." }
    : analysisMatch.status === "strong"
      ? { status: "strong" as AlignmentStatus, explanation: "The planned analysis can handle the type of data the collection method is expected to produce." }
      : analysisMatch.status === "weak"
        ? { status: "weak" as AlignmentStatus, explanation: "The analysis method does not appear to fit the expected data." }
        : { status: "partial" as AlignmentStatus, explanation: "The connection is possible, but the exact data or analysis technique needs more detail." };

  const alignment: AlignmentResult[] = [
    { id: "topic-problem", from: "Topic", to: "Problem", ...topicProblem },
    { id: "problem-question", from: "Problem", to: "Research question", ...problemQuestion },
    { id: "question-objectives", from: "Research question", to: "Objectives", ...questionObjectives },
    { id: "objectives-methodology", from: "Objectives", to: "Methodology", status: approachFit.status, explanation: approachFit.explanation },
    { id: "methodology-collection", from: "Methodology", to: "Data collection", status: collectionMatch.status, explanation: collectionMatch.explanation },
    { id: "collection-analysis", from: "Data collection", to: "Data analysis", ...collectionAnalysis },
  ];

  const proposalChecklist = checklist(data, collectionMatch.status);
  const essentialScore = essentialFields.reduce(
    (total, field) => total + (isFilled(data[field]) ? 5 : 0),
    0,
  );
  const supportingWeights: Array<[keyof ResearchFormData, number]> = [
    ["background", 2],
    ["subjectArea", 1],
    ["problemImportance", 2],
    ["researchGap", 3],
    ["additionalQuestions", 1],
    ["specificObjectives", 4],
    ["design", 2],
    ["targetPopulation", 2],
    ["sampleDescription", 2],
    ["sampleSize", 1],
    ["samplingMethod", 2],
    ["dataAnalysis", 3],
    ["ethics", 2],
    ["duration", 1],
    ["expectedOutcome", 2],
  ];
  const supportingScore = supportingWeights.reduce(
    (total, [field, weight]) => total + (isFilled(data[field]) ? weight : 0),
    0,
  );
  const penalties = feedback.reduce((total, item) => {
    if (item.type === "critical") return total + 4.5;
    if (item.type === "warning") return total + 2.5;
    if (item.type === "improvement") return total + 1.25;
    return total;
  }, 0);
  const qualityScore = Math.max(0, 25 - penalties);
  const alignmentValues: Record<AlignmentStatus, number> = {
    strong: 3,
    partial: 2,
    weak: 0.5,
    insufficient: 0,
  };
  const alignmentScore =
    (alignment.reduce((total, item) => total + alignmentValues[item.status], 0) /
      (alignment.length * 3)) *
    15;
  const score = Math.max(
    0,
    Math.min(100, Math.round(essentialScore + supportingScore + qualityScore + alignmentScore)),
  );

  return {
    score,
    label: readinessLabel(score),
    feedback,
    alignment,
    checklist: proposalChecklist,
    strengths: feedback.filter((item) => item.type === "strength").length,
    issues: feedback.filter((item) => ["critical", "warning", "missing"].includes(item.type)).length,
    recommendations: feedback.filter((item) => item.type !== "strength").length,
    generatedAt: new Date().toISOString(),
  };
}
