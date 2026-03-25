import { type ReactNode, createContext, useContext, useState } from "react";
import type { AnalysisResult } from "../lib/analysisEngine";
import type { Language } from "../lib/i18n";

export interface StoredReport {
  id: string;
  title: string;
  reportText: string;
  analysisResult: AnalysisResult;
  createdAt: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentResult: AnalysisResult | null;
  setCurrentResult: (result: AnalysisResult | null) => void;
  currentReportTitle: string;
  setCurrentReportTitle: (title: string) => void;
  currentReportId: string | null;
  setCurrentReportId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(
    null,
  );
  const [currentReportTitle, setCurrentReportTitle] = useState<string>("");
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentResult,
        setCurrentResult,
        currentReportTitle,
        setCurrentReportTitle,
        currentReportId,
        setCurrentReportId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
