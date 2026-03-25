import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle, FileText, Upload } from "lucide-react";
import { type DragEvent, useRef, useState } from "react";
import type { Report } from "../backend";
import { useAppContext } from "../context/AppContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { analyzeReport } from "../lib/analysisEngine";
import { t } from "../lib/i18n";

export function UploadPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const {
    language,
    setCurrentResult,
    setCurrentReportTitle,
    setCurrentReportId,
  } = useAppContext();
  const navigate = useNavigate();

  const [reportTitle, setReportTitle] = useState("");
  const [reportText, setReportText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    if (f.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => setReportText(e.target?.result as string);
      reader.readAsText(f);
    } else {
      setReportText(
        `[File uploaded: ${f.name}] This is a ${f.type} file. Simulated text extraction from medical report.\nGlucose: 140 mg/dL\nBlood Pressure: 145/92 mmHg\nHemoglobin: 10.5 g/dL\nTotal Cholesterol: 230 mg/dL`,
      );
    }
    if (!reportTitle) setReportTitle(f.name.replace(/\.[^.]+$/, ""));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleAnalyze = async () => {
    const text = reportText.trim();
    if (!text) {
      setError("Please upload a file or paste report text.");
      return;
    }
    if (!reportTitle.trim()) {
      setError("Please enter a report title.");
      return;
    }
    setError("");
    setAnalyzing(true);

    // Run frontend analysis engine
    // /predict/report - Placeholder for Flask/external AI integration
    const result = analyzeReport(text);

    try {
      if (actor && identity) {
        const principal = identity.getPrincipal().toString();
        const report: Report = {
          id: crypto.randomUUID(),
          doi: JSON.stringify(result),
          title: reportTitle.trim(),
          methods: text,
          results: JSON.stringify(result.conditions),
          author: principal,
          imageIds: [],
          findings: JSON.stringify({
            severity: result.severity,
            confidenceScore: result.confidenceScore,
          }),
          abstractId: "",
          uploadDate: BigInt(Date.now()),
        };
        await actor.saveReport(report);
        setCurrentReportId(report.id);
      }
    } catch (err) {
      console.error("Save failed:", err);
    }

    setCurrentResult(result);
    setCurrentReportTitle(reportTitle.trim());
    setAnalyzing(false);
    navigate({ to: "/results" });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {t(language, "uploadReport")}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {t(language, "supportedFormats")}
      </p>

      {/* Title input */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-4">
        <label
          htmlFor="report-title"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {t(language, "reportTitle")}
        </label>
        <input
          id="report-title"
          type="text"
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
          placeholder={t(language, "reportTitlePlaceholder")}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Drop zone */}
      <div
        className={`bg-white border-2 border-dashed rounded-xl p-10 text-center shadow-sm mb-4 transition-colors ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle size={40} className="text-green-500" />
            <p className="text-sm font-medium text-gray-800">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setReportText("");
              }}
              className="text-xs text-red-500 hover:underline mt-1"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Upload size={28} className="text-blue-500" />
            </div>
            <p className="font-semibold text-gray-700">
              {t(language, "dragDrop")}
            </p>
            <p className="text-sm text-gray-400">{t(language, "orClick")}</p>
            <p className="text-xs text-gray-400">
              {t(language, "supportedFormats")}
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              {t(language, "chooseFile")}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        )}
      </div>

      {/* Text paste */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-700">
            Or paste report text
          </span>
        </div>
        <textarea
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder={t(language, "pasteText")}
          rows={8}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={analyzing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
      >
        {analyzing ? t(language, "analyzing") : t(language, "analyzeReport")}
      </button>
    </div>
  );
}
