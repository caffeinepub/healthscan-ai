import { Link } from "@tanstack/react-router";
import { Eye, FileText, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Report } from "../backend";
import { useAppContext } from "../context/AppContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { AnalysisResult } from "../lib/analysisEngine";
import { t } from "../lib/i18n";

interface ParsedReport {
  id: string;
  title: string;
  analysisResult: AnalysisResult;
  createdAt: string;
}

function parseSavedReport(r: Report): ParsedReport | null {
  try {
    const analysis = JSON.parse(r.doi) as AnalysisResult;
    return {
      id: r.id,
      title: r.title,
      analysisResult: analysis,
      createdAt: new Date(Number(r.uploadDate)).toLocaleDateString(),
    };
  } catch {
    return null;
  }
}

export function HistoryPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const {
    language,
    setCurrentResult,
    setCurrentReportTitle,
    setCurrentReportId,
  } = useAppContext();
  const [reports, setReports] = useState<ParsedReport[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!actor || !identity) return;
    try {
      const all = await actor.searchReports("");
      const myPrincipal = identity.getPrincipal().toString();
      const mine = all
        .filter((r: Report) => r.author === myPrincipal)
        .map(parseSavedReport)
        .filter(Boolean) as ParsedReport[];
      mine.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setReports(mine);
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  }, [actor, identity]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!actor || !confirm(t(language, "confirmDelete"))) return;
    try {
      await actor.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const severityBadge = (severity: string) => {
    const map: Record<string, string> = {
      Mild: "bg-green-100 text-green-800",
      Moderate: "bg-yellow-100 text-yellow-800",
      Severe: "bg-red-100 text-red-800",
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[severity] ?? "bg-gray-100 text-gray-800"}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t(language, "history")}
      </h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-white border border-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center shadow-sm">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            {t(language, "noReports")}
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            {t(language, "uploadFirst")}
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            {t(language, "uploadReport")}
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t(language, "reportName")}
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                  {t(language, "date")}
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Conditions
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t(language, "severity")}
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t(language, "action")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-400 sm:hidden mt-0.5">
                      {r.createdAt}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 hidden sm:table-cell">
                    {r.createdAt}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {r.analysisResult.conditions.length > 0
                      ? r.analysisResult.conditions
                          .map((c) => c.name)
                          .join(", ")
                      : "None detected"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={severityBadge(r.analysisResult.severity)}>
                      {t(language, r.analysisResult.severity.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to="/results"
                        onClick={() => {
                          setCurrentResult(r.analysisResult);
                          setCurrentReportTitle(r.title);
                          setCurrentReportId(r.id);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye size={13} />
                        {t(language, "viewResults")}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                        <span className="hidden sm:inline">
                          {t(language, "deleteReport")}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
