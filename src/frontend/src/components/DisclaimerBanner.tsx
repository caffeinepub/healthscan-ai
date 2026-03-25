import { AlertTriangle } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { t } from "../lib/i18n";

export function DisclaimerBanner() {
  const { language } = useAppContext();
  return (
    <div className="flex items-start gap-3 px-4 py-3 mb-6 bg-amber-50 border border-amber-200 rounded-xl">
      <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={20} />
      <p className="text-sm font-semibold text-amber-900">
        {t(language, "disclaimer")}
      </p>
    </div>
  );
}
