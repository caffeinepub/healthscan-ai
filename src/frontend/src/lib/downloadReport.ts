import type { AnalysisResult } from "./analysisEngine";

export function downloadReport(result: AnalysisResult, title: string): void {
  const reportData = {
    title,
    generatedAt: new Date().toISOString(),
    disclaimer:
      "This AI analysis is for educational purposes only. Always consult a licensed medical professional.",
    detectedConditions: result.conditions.map((c) => ({
      name: c.name,
      description: c.description,
      indicators: c.indicators,
    })),
    severityLevel: result.severity,
    confidenceScore: `${result.confidenceScore}%`,
    recommendations: result.recommendations,
    abnormalValues: result.abnormalValues,
  };

  const json = JSON.stringify(reportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-analysis.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
