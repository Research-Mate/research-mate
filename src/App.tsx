import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ResearchForm } from "./components/ResearchForm";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { allProgressFields, emptyResearchForm, essentialFields, sampleResearchForm, STORAGE_KEY } from "./data/formData";
import type { AnalysisResult, FormErrors, ResearchFormData } from "./types/research";
import { analyzeResearch } from "./utils/analysisEngine";

interface StoredDraft {
  data: ResearchFormData;
  savedAt: string;
}

function loadDraft(): ResearchFormData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyResearchForm;
    const parsed = JSON.parse(stored) as StoredDraft;
    return { ...emptyResearchForm, ...parsed.data };
  } catch {
    return emptyResearchForm;
  }
}

function hasDraft(): boolean {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

const hasContent = (data: ResearchFormData) =>
  Object.values(data).some((value) => value.trim().length > 0);

export default function App() {
  const [data, setData] = useState<ResearchFormData>(loadDraft);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [saved, setSaved] = useState(hasDraft);

  const progress = useMemo(() => {
    const completed = allProgressFields.filter((field) => data[field].trim()).length;
    const essentialsComplete = essentialFields.filter((field) => data[field].trim()).length;
    return {
      completed,
      total: allProgressFields.length,
      percent: Math.round((completed / allProgressFields.length) * 100),
      essentialsComplete,
      essentialsTotal: essentialFields.length,
    };
  }, [data]);

  useEffect(() => {
    setSaved(false);
    const timeout = window.setTimeout(() => {
      try {
        if (hasContent(data)) {
          const draft: StoredDraft = { data, savedAt: new Date().toISOString() };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
          setSaved(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          setSaved(false);
        }
      } catch {
        setSaved(false);
      }
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [data]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const field = event.target.name as keyof ResearchFormData;
    setData((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    essentialFields.forEach((field) => {
      if (!data[field].trim()) {
        nextErrors[field] = "This essential field is needed before analysis.";
      }
    });
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      const firstField = essentialFields.find((field) => nextErrors[field]);
      if (firstField) {
        document.getElementById(firstField)?.focus();
        document.getElementById(firstField)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setIsAnalyzing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setResult(analyzeResearch(data));
    setIsAnalyzing(false);
    window.setTimeout(() => {
      const results = document.getElementById("results");
      results?.scrollIntoView({ behavior: "smooth", block: "start" });
      results?.focus({ preventScroll: true });
    }, 60);
  };

  const handleLoadSample = () => {
    if (hasContent(data) && !window.confirm("Replace your current entries with the sample project?")) return;
    setData(sampleResearchForm);
    setErrors({});
    setResult(null);
    window.setTimeout(() => document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" }), 30);
  };

  const handleReset = () => {
    if ((hasContent(data) || result) && !window.confirm("Clear this draft and its results? This cannot be undone.")) return;
    setData(emptyResearchForm);
    setErrors({});
    setResult(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // The form still resets if browser storage is unavailable.
    }
    window.setTimeout(() => document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" }), 30);
  };

  const scrollToForm = () => {
    document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => document.getElementById("topic")?.focus({ preventScroll: true }), 450);
  };

  return (
    <>
      <a className="skip-link" href="#review-form">
        Skip to proposal form
      </a>
      <Header onLoadSample={handleLoadSample} />
      <main>
        <Hero onStart={scrollToForm} />
        <ResearchForm
          data={data}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onLoadSample={handleLoadSample}
          onReset={handleReset}
          isAnalyzing={isAnalyzing}
          progress={progress}
          saved={saved}
        />
        {result && <ResultsDashboard result={result} data={data} onReviewAgain={scrollToForm} />}
      </main>
      <Footer />
    </>
  );
}
