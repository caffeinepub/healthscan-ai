import { Link } from "@tanstack/react-router";
import { Calendar, FileText, TrendingUp, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Report } from "../backend";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
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

const SEVERITY_ORDER = { Mild: 0, Moderate: 1, Severe: 2 };

export function DashboardPage() {
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

  useEffect(() => {
    if (!actor || !identity) return;
    const load = async () => {
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
    };
    load();
  }, [actor, identity]);

  const totalReports = reports.length;
  const lastScan = reports[0]?.createdAt ?? "-";
  const severityCounts = { Mild: 0, Moderate: 0, Severe: 0 };
  for (const r of reports) {
    if (r.analysisResult.severity in severityCounts) {
      severityCounts[r.analysisResult.severity]++;
    }
  }
  const avgSeverity =
    totalReports === 0
      ? "-"
      : Object.entries(severityCounts).sort((a, b) => b[1] - a[1])[0][0];

  const chartData = reports
    .slice()
    .reverse()
    .map((r) => ({
      date: r.createdAt,
      confidence: r.analysisResult.confidenceScore,
      severity: SEVERITY_ORDER[r.analysisResult.severity],
    }));

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
      <DisclaimerBanner />

      {/* Hero */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t(language, "welcomeBack")} 👋
          </h1>
          <p className="text-gray-500 mt-1">{t(language, "letsAnalyze")}</p>
        </div>
        <Link
          to="/upload"
          className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Upload size={16} />
          {t(language, "uploadReport")}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-500 font-medium">
              {t(language, "totalReports")}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalReports}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500 font-medium">
              {t(language, "avgSeverity")}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {avgSeverity === "-"
              ? "-"
              : t(language, avgSeverity.toLowerCase() as string)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar size={16} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500 font-medium">
              {t(language, "lastScan")}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{lastScan}</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">
            {t(language, "healthTrends")}
          </h2>
          {chartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  stroke="#9CA3AF"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  stroke="#9CA3AF"
                />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, "Confidence"]}
                />
                <Area
                  type="monotone"
                  dataKey="confidence"
                  stroke="#2563EB"
                  fill="url(#colorConf)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-52 text-gray-400">
              <TrendingUp size={40} className="mb-3 opacity-30" />
              <p className="text-sm">{t(language, "noTrendData")}</p>
            </div>
          )}
        </div>

        {/* Reports list */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">
            {t(language, "reportHistory")}
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <FileText size={36} className="mb-3 opacity-30" />
              <p className="text-sm">{t(language, "noReports")}</p>
              <Link
                to="/upload"
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                {t(language, "uploadFirst")}
              </Link>
            </div>
          ) : (
            <div
              className="space-y-2 overflow-y-auto"
              style={{ maxHeight: "280px" }}
            >
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-500">{r.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <span className={severityBadge(r.analysisResult.severity)}>
                      {t(language, r.analysisResult.severity.toLowerCase())}
                    </span>
                    <Link
                      to="/results"
                      onClick={() => {
                        setCurrentResult(r.analysisResult);
                        setCurrentReportTitle(r.title);
                        setCurrentReportId(r.id);
                      }}
                      className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                    >
                      {t(language, "viewResults")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
