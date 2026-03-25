import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Download,
  Droplets,
  Filter,
  Heart,
  Pill,
  Scissors,
  Shield,
  Stethoscope,
  TrendingUp,
  Wind,
  Zap,
} from "lucide-react";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { useAppContext } from "../context/AppContext";
import { downloadReport } from "../lib/downloadReport";
import { t } from "../lib/i18n";

const ICON_MAP: Record<string, React.ElementType> = {
  Activity,
  Heart,
  Droplets,
  TrendingUp,
  Zap,
  Filter,
  Shield,
  Wind,
};

function ConfidenceGauge({ score }: { score: number }) {
  const radius = 56;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 70 ? "#16A34A" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 140 80"
        className="w-40 h-24"
        role="img"
        aria-label={`Confidence score: ${score}%`}
      >
        <title>Confidence Score Gauge</title>
        <path
          d="M 14 70 A 56 56 0 0 1 126 70"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 14 70 A 56 56 0 0 1 126 70"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
        <text
          x="70"
          y="65"
          textAnchor="middle"
          fontSize="22"
          fontWeight="bold"
          fill="#111827"
        >
          {score}%
        </text>
      </svg>
      <p className="text-xs text-gray-500 font-medium">AI's confidence</p>
    </div>
  );
}

const severityConfig = {
  Mild: {
    cls: "bg-green-100 text-green-800",
    bar: "bg-green-500",
    label: "Low health risk. Regular monitoring recommended.",
    width: "w-1/3",
  },
  Moderate: {
    cls: "bg-yellow-100 text-yellow-800",
    bar: "bg-yellow-500",
    label: "Moderate risk. Lifestyle changes and medical consultation advised.",
    width: "w-2/3",
  },
  Severe: {
    cls: "bg-red-100 text-red-800",
    bar: "bg-red-500",
    label: "High risk. Immediate medical attention strongly recommended.",
    width: "w-full",
  },
};

export function ResultsPage() {
  const { currentResult, currentReportTitle, language } = useAppContext();

  if (!currentResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <p className="text-gray-500">No analysis results to display.</p>
        <Link to="/upload" className="text-blue-600 hover:underline text-sm">
          {t(language, "uploadReport")}
        </Link>
      </div>
    );
  }

  const {
    conditions,
    severity,
    confidenceScore,
    recommendations,
    abnormalValues,
  } = currentResult;
  const sev = severityConfig[severity];

  return (
    <div className="max-w-5xl mx-auto">
      <DisclaimerBanner />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2"
          >
            <ArrowLeft size={14} />
            {t(language, "backToDashboard")}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {t(language, "analysisComplete")}
          </h1>
          {currentReportTitle && (
            <p className="text-sm text-gray-500 mt-0.5">{currentReportTitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() =>
            downloadReport(currentResult, currentReportTitle || "report")
          }
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Download size={16} />
          {t(language, "downloadReport")}
        </button>
      </div>

      {/* Top cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Detected Conditions */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">
            {t(language, "detectedConditions")}
          </h2>
          {conditions.length === 0 ? (
            <p className="text-sm text-gray-400">
              {t(language, "noConditions")}
            </p>
          ) : (
            <ul className="space-y-2">
              {conditions.map((c) => {
                const Icon = ICON_MAP[c.iconName] ?? Activity;
                return (
                  <li key={c.name} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-500 leading-snug">
                        {c.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Severity */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">
            {t(language, "severityLevel")}
          </h2>
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${sev.cls}`}
            >
              {t(language, severity.toLowerCase())}
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all ${sev.bar} ${sev.width}`}
            />
          </div>
          <p className="text-xs text-gray-600">{sev.label}</p>
        </div>

        {/* Confidence Score */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center">
          <h2 className="font-semibold text-gray-800 mb-2">
            {t(language, "confidenceScore")}
          </h2>
          <ConfidenceGauge score={confidenceScore} />
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">
          {t(language, "recommendations")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Treatments */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope size={14} className="text-white" />
              </div>
              <h3 className="text-sm font-semibold text-blue-900">
                {t(language, "treatments")}
              </h3>
            </div>
            {recommendations.treatments.length === 0 ? (
              <p className="text-xs text-blue-700">
                No specific treatments identified.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {recommendations.treatments.map((tx) => (
                  <li
                    key={tx}
                    className="text-xs text-blue-800 flex items-start gap-1.5"
                  >
                    <span className="text-blue-400 mt-0.5">•</span>
                    {tx}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Medicines */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
                <Pill size={14} className="text-white" />
              </div>
              <h3 className="text-sm font-semibold text-green-900">
                {t(language, "medicines")}
              </h3>
            </div>
            {recommendations.medicines.length === 0 ? (
              <p className="text-xs text-green-700">
                No specific medicines identified.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {recommendations.medicines.map((med) => (
                  <li
                    key={med}
                    className="text-xs text-green-800 flex items-start gap-1.5"
                  >
                    <span className="text-green-400 mt-0.5">•</span>
                    {med}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Surgical - only if Severe */}
          {severity === "Severe" && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                  <Scissors size={14} className="text-white" />
                </div>
                <h3 className="text-sm font-semibold text-red-900">
                  {t(language, "surgicalProcedures")}
                </h3>
              </div>
              {recommendations.surgicalProcedures.length === 0 ? (
                <p className="text-xs text-red-700">
                  No surgical procedures identified.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {recommendations.surgicalProcedures.map((proc) => (
                    <li
                      key={proc}
                      className="text-xs text-red-800 flex items-start gap-1.5"
                    >
                      <span className="text-red-400 mt-0.5">•</span>
                      {proc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Abnormal Values */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-red-500" />
          <h2 className="font-semibold text-gray-800">
            {t(language, "abnormalValues")}
          </h2>
        </div>
        {abnormalValues.length === 0 ? (
          <p className="text-sm text-gray-400">{t(language, "noAbnormal")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {t(language, "parameter")}
                  </th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {t(language, "value")}
                  </th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {t(language, "normalRange")}
                  </th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {t(language, "status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {abnormalValues.map((av) => (
                  <tr
                    key={av.parameter}
                    className="border-b border-gray-50 hover:bg-red-50/50 transition-colors"
                  >
                    <td className="py-2.5 pr-4 font-medium text-gray-800">
                      {av.parameter}
                    </td>
                    <td className="py-2.5 pr-4 font-semibold text-red-600">
                      {av.value}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-500">{av.normal}</td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          av.status === "high"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {av.status === "high"
                          ? t(language, "highLabel")
                          : t(language, "lowLabel")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
