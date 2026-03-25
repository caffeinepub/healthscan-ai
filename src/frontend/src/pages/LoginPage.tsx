import { Activity, Globe, Shield, Zap } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { type Language, t } from "../lib/i18n";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "hi", label: "हिंदी" },
];

export function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();
  const { language, setLanguage } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Branding */}
        <div className="hidden md:flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Activity size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold">
              <span className="text-gray-900">Health</span>
              <span className="text-blue-600">Scan-AI</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            {t(language, "loginDescription")}
          </p>
          <div className="space-y-4">
            {[
              { icon: Activity, text: t(language, "feature1") },
              { icon: Shield, text: t(language, "feature2") },
              { icon: Globe, text: t(language, "feature3") },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon size={16} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <Zap size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 font-medium">
              {t(language, "disclaimer")}
            </p>
          </div>
        </div>

        {/* Right: Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-2 mb-2 md:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl">
              <span className="text-gray-900">Health</span>
              <span className="text-blue-600">Scan-AI</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {t(language, "login")}
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            {t(language, "loginDescription")}
          </p>

          <button
            type="button"
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Shield size={18} />
            {isLoggingIn ? "Connecting..." : t(language, "loginWithII")}
          </button>

          <p className="text-xs text-gray-400 text-center mt-6">
            Powered by the Internet Computer. Your data is stored securely
            on-chain.
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <label
              htmlFor="login-lang"
              className="text-xs text-gray-500 font-medium mb-2 block"
            >
              Language
            </label>
            <select
              id="login-lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
