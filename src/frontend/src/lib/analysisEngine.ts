// /predict/report - Placeholder for Flask/external AI integration
// POST /predict/report { text: string } -> AnalysisResult

export interface DetectedCondition {
  name: string;
  iconName: string;
  description: string;
  indicators: string[];
}

export interface AbnormalValue {
  parameter: string;
  value: string;
  normal: string;
  status: "high" | "low";
}

export interface AnalysisResult {
  conditions: DetectedCondition[];
  severity: "Mild" | "Moderate" | "Severe";
  confidenceScore: number;
  recommendations: {
    treatments: string[];
    medicines: string[];
    surgicalProcedures: string[];
  };
  abnormalValues: AbnormalValue[];
}

function extractNumber(text: string, patterns: RegExp[]): number | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number.parseFloat(match[1]);
  }
  return null;
}

export function analyzeReport(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  const conditions: DetectedCondition[] = [];
  const abnormalValues: AbnormalValue[] = [];
  let matchedKeywords = 0;
  const totalKeywords = 40;

  // --- Glucose / Diabetes ---
  const glucoseVal = extractNumber(text, [
    /glucose[:\s]+([\d.]+)/i,
    /blood sugar[:\s]+([\d.]+)/i,
    /fasting glucose[:\s]+([\d.]+)/i,
    /hba1c[:\s]+([\d.]+)/i,
  ]);
  const hasDiabetesKeywords =
    /diabetes|diabetic|hyperglycemia|insulin resistance/i.test(lower);
  if (hasDiabetesKeywords || (glucoseVal !== null && glucoseVal > 126)) {
    matchedKeywords += hasDiabetesKeywords ? 3 : 2;
    if (glucoseVal !== null && glucoseVal > 126) {
      abnormalValues.push({
        parameter: "Blood Glucose",
        value: `${glucoseVal} mg/dL`,
        normal: "70-100 mg/dL",
        status: "high",
      });
    }
    conditions.push({
      name: "Diabetes Mellitus",
      iconName: "Activity",
      description:
        "Elevated blood glucose levels indicating diabetes or pre-diabetes.",
      indicators: glucoseVal
        ? [`Glucose: ${glucoseVal} mg/dL`]
        : ["diabetes keywords detected"],
    });
  }

  // --- Blood Pressure / Hypertension ---
  const bpMatch = text.match(/(\d{2,3})\s*\/\s*(\d{2,3})\s*(?:mmHg|mm Hg)?/i);
  const systolic = bpMatch ? Number.parseInt(bpMatch[1]) : null;
  const diastolic = bpMatch ? Number.parseInt(bpMatch[2]) : null;
  const hasHtnKeywords =
    /hypertension|high blood pressure|elevated bp|stage [12] hypertension/i.test(
      lower,
    );
  if (hasHtnKeywords || (systolic !== null && systolic > 140)) {
    matchedKeywords += hasHtnKeywords ? 3 : 2;
    if (systolic !== null && systolic > 140) {
      abnormalValues.push({
        parameter: "Blood Pressure",
        value: `${systolic}/${diastolic} mmHg`,
        normal: "<120/80 mmHg",
        status: "high",
      });
    }
    conditions.push({
      name: "Hypertension",
      iconName: "Heart",
      description:
        "Elevated blood pressure that may increase risk of heart disease and stroke.",
      indicators: systolic
        ? [`BP: ${systolic}/${diastolic} mmHg`]
        : ["hypertension keywords detected"],
    });
  }

  // --- Hemoglobin / Anemia ---
  const hgbVal = extractNumber(text, [
    /hemoglobin[:\s]+([\d.]+)/i,
    /hgb[:\s]+([\d.]+)/i,
    /hb[:\s]+([\d.]+)/i,
  ]);
  const hasAnemiaKeywords =
    /anemia|anaemia|low hemoglobin|iron deficiency/i.test(lower);
  if (hasAnemiaKeywords || (hgbVal !== null && hgbVal < 12.5)) {
    matchedKeywords += hasAnemiaKeywords ? 3 : 2;
    if (hgbVal !== null && hgbVal < 12.5) {
      abnormalValues.push({
        parameter: "Hemoglobin",
        value: `${hgbVal} g/dL`,
        normal: "12.5-17.5 g/dL",
        status: "low",
      });
    }
    conditions.push({
      name: "Anemia",
      iconName: "Droplets",
      description:
        "Low hemoglobin levels indicating reduced red blood cell count.",
      indicators: hgbVal
        ? [`Hemoglobin: ${hgbVal} g/dL`]
        : ["anemia keywords detected"],
    });
  }

  // --- Cholesterol ---
  const cholVal = extractNumber(text, [
    /total cholesterol[:\s]+([\d.]+)/i,
    /cholesterol[:\s]+([\d.]+)/i,
  ]);
  const hasCholeKeywords =
    /hypercholesterolemia|high cholesterol|dyslipidemia/i.test(lower);
  if (hasCholeKeywords || (cholVal !== null && cholVal > 200)) {
    matchedKeywords += hasCholeKeywords ? 2 : 2;
    if (cholVal !== null && cholVal > 200) {
      abnormalValues.push({
        parameter: "Total Cholesterol",
        value: `${cholVal} mg/dL`,
        normal: "<200 mg/dL",
        status: "high",
      });
    }
    conditions.push({
      name: "High Cholesterol",
      iconName: "TrendingUp",
      description:
        "Elevated cholesterol levels that may increase cardiovascular risk.",
      indicators: cholVal
        ? [`Cholesterol: ${cholVal} mg/dL`]
        : ["cholesterol keywords detected"],
    });
  }

  // --- Thyroid ---
  const tshVal = extractNumber(text, [
    /tsh[:\s]+([\d.]+)/i,
    /thyroid stimulating hormone[:\s]+([\d.]+)/i,
  ]);
  const hasThyroidKeywords =
    /thyroid|hypothyroid|hyperthyroid|tsh elevated|tsh low/i.test(lower);
  if (
    hasThyroidKeywords ||
    (tshVal !== null && (tshVal > 4.5 || tshVal < 0.4))
  ) {
    matchedKeywords += hasThyroidKeywords ? 3 : 2;
    if (tshVal !== null) {
      if (tshVal > 4.5)
        abnormalValues.push({
          parameter: "TSH",
          value: `${tshVal} mIU/L`,
          normal: "0.4-4.5 mIU/L",
          status: "high",
        });
      else if (tshVal < 0.4)
        abnormalValues.push({
          parameter: "TSH",
          value: `${tshVal} mIU/L`,
          normal: "0.4-4.5 mIU/L",
          status: "low",
        });
    }
    conditions.push({
      name: "Thyroid Disorder",
      iconName: "Zap",
      description:
        "Abnormal thyroid hormone levels affecting metabolism and energy.",
      indicators: tshVal
        ? [`TSH: ${tshVal} mIU/L`]
        : ["thyroid keywords detected"],
    });
  }

  // --- Kidney ---
  const creatVal = extractNumber(text, [
    /creatinine[:\s]+([\d.]+)/i,
    /serum creatinine[:\s]+([\d.]+)/i,
  ]);
  const hasKidneyKeywords =
    /kidney disease|renal failure|chronic kidney|nephropathy|ckd/i.test(lower);
  if (hasKidneyKeywords || (creatVal !== null && creatVal > 1.2)) {
    matchedKeywords += hasKidneyKeywords ? 3 : 2;
    if (creatVal !== null && creatVal > 1.2) {
      abnormalValues.push({
        parameter: "Creatinine",
        value: `${creatVal} mg/dL`,
        normal: "0.6-1.2 mg/dL",
        status: "high",
      });
    }
    conditions.push({
      name: "Kidney Issue",
      iconName: "Filter",
      description: "Elevated creatinine or kidney disease markers detected.",
      indicators: creatVal
        ? [`Creatinine: ${creatVal} mg/dL`]
        : ["kidney keywords detected"],
    });
  }

  // --- Liver ---
  const altVal = extractNumber(text, [
    /alt[:\s]+([\d.]+)/i,
    /alanine aminotransferase[:\s]+([\d.]+)/i,
  ]);
  const hasLiverKeywords =
    /liver disease|hepatitis|cirrhosis|elevated alt|elevated ast|fatty liver/i.test(
      lower,
    );
  if (hasLiverKeywords || (altVal !== null && altVal > 56)) {
    matchedKeywords += hasLiverKeywords ? 3 : 2;
    if (altVal !== null && altVal > 56) {
      abnormalValues.push({
        parameter: "ALT",
        value: `${altVal} U/L`,
        normal: "7-56 U/L",
        status: "high",
      });
    }
    conditions.push({
      name: "Liver Issue",
      iconName: "Shield",
      description: "Elevated liver enzymes or liver disease markers detected.",
      indicators: altVal ? [`ALT: ${altVal} U/L`] : ["liver keywords detected"],
    });
  }

  // --- Respiratory ---
  const hasRespiratoryKeywords =
    /covid|coronavirus|pneumonia|bronchitis|asthma|copd|respiratory/i.test(
      lower,
    );
  const hasFeverCough = /fever/i.test(lower) && /cough/i.test(lower);
  if (hasRespiratoryKeywords || hasFeverCough) {
    matchedKeywords += 2;
    conditions.push({
      name: "Respiratory Issue",
      iconName: "Wind",
      description: "Respiratory symptoms or conditions detected.",
      indicators: ["respiratory keywords detected"],
    });
  }

  // Severity based on number of conditions
  let severity: "Mild" | "Moderate" | "Severe";
  if (conditions.length >= 5) severity = "Severe";
  else if (conditions.length >= 3) severity = "Moderate";
  else severity = "Mild";

  // Confidence score
  const rawConfidence =
    conditions.length === 0
      ? 0
      : Math.min(
          97,
          Math.max(
            40,
            Math.round((matchedKeywords / totalKeywords) * 100 * 2.5),
          ),
        );
  const confidenceScore = conditions.length === 0 ? 0 : rawConfidence;

  // Recommendations
  const treatments: string[] = [];
  const medicines: string[] = [];
  const surgicalProcedures: string[] = [];

  for (const condition of conditions) {
    if (condition.name === "Diabetes Mellitus") {
      treatments.push(
        "Low-carb diet, regular exercise (150 min/week), blood glucose monitoring",
      );
      medicines.push("Metformin (first-line), Glipizide, Insulin (if needed)");
      if (severity === "Severe")
        surgicalProcedures.push("Bariatric surgery (for obesity-related T2DM)");
    }
    if (condition.name === "Hypertension") {
      treatments.push(
        "DASH diet, sodium restriction (<2.3g/day), stress management, regular aerobic exercise",
      );
      medicines.push("Amlodipine, Lisinopril, Hydrochlorothiazide");
      if (severity === "Severe")
        surgicalProcedures.push(
          "Renal denervation (for resistant hypertension)",
        );
    }
    if (condition.name === "Anemia") {
      treatments.push(
        "Iron-rich diet (leafy greens, legumes, red meat), Vitamin C supplementation",
      );
      medicines.push("Ferrous sulfate, Folic acid, Vitamin B12 injections");
      if (severity === "Severe")
        surgicalProcedures.push("Blood transfusion (for severe anemia)");
    }
    if (condition.name === "High Cholesterol") {
      treatments.push(
        "Plant-based diet, reduce saturated fats, increase fiber intake, regular exercise",
      );
      medicines.push("Atorvastatin, Rosuvastatin, Ezetimibe");
    }
    if (condition.name === "Thyroid Disorder") {
      treatments.push(
        "Regular thyroid function monitoring, iodine-balanced diet",
      );
      medicines.push(
        "Levothyroxine (hypothyroidism), Methimazole (hyperthyroidism)",
      );
      if (severity === "Severe")
        surgicalProcedures.push(
          "Thyroidectomy (for thyroid nodules or cancer)",
        );
    }
    if (condition.name === "Kidney Issue") {
      treatments.push(
        "Low-protein diet, fluid management, blood pressure control",
      );
      medicines.push(
        "ACE inhibitors (e.g., Lisinopril), Furosemide (diuretic)",
      );
      if (severity === "Severe")
        surgicalProcedures.push("Dialysis or Kidney transplant");
    }
    if (condition.name === "Liver Issue") {
      treatments.push(
        "Avoid alcohol, low-fat diet, regular liver function monitoring",
      );
      medicines.push("Ursodiol, N-acetylcysteine (antioxidant support)");
      if (severity === "Severe")
        surgicalProcedures.push(
          "Liver transplant (for end-stage liver disease)",
        );
    }
    if (condition.name === "Respiratory Issue") {
      treatments.push(
        "Breathing exercises, avoid smoke/pollutants, stay hydrated, rest",
      );
      medicines.push(
        "Salbutamol inhaler, Prednisolone (short-course), Antivirals if needed",
      );
    }
  }

  // Deduplicate
  const uniqueTreatments = [...new Set(treatments)];
  const uniqueMedicines = [...new Set(medicines)];
  const uniqueSurgical =
    severity === "Severe" ? [...new Set(surgicalProcedures)] : [];

  return {
    conditions,
    severity,
    confidenceScore,
    recommendations: {
      treatments: uniqueTreatments,
      medicines: uniqueMedicines,
      surgicalProcedures: uniqueSurgical,
    },
    abnormalValues,
  };
}
