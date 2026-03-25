import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  Globe,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Upload,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { type Language, t } from "../lib/i18n";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "hi", label: "हिंदी" },
];

export function Layout({ children }: { children: ReactNode }) {
  const { clear } = useInternetIdentity();
  const { language, setLanguage } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: t(language, "dashboard"), icon: LayoutDashboard },
    { to: "/upload", label: t(language, "uploadReport"), icon: Upload },
    { to: "/history", label: t(language, "history"), icon: History },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB]">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-gray-900">Health</span>
              <span className="text-blue-600">Scan-AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium pb-1 transition-colors ${
                  isActive(to)
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative hidden sm:block">
              <label htmlFor="lang-select" className="sr-only">
                Language
              </label>
              <select
                id="lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <Globe
                size={14}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            <Link
              to="/upload"
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Upload size={14} />
              {t(language, "uploadReport")}
            </Link>

            <button
              type="button"
              onClick={() => clear()}
              className="hidden md:flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut size={14} />
              {t(language, "logout")}
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/40">
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-default"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <div className="relative bg-white w-72 h-full shadow-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-gray-900">Health</span>
                <span className="text-blue-600">Scan-AI</span>
              </span>
            </div>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} /> {label}
              </Link>
            ))}
            <div className="mt-2">
              <label
                htmlFor="mobile-lang-select"
                className="text-xs text-gray-500 font-medium mb-1 block"
              >
                Language
              </label>
              <select
                id="mobile-lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                clear();
                setMobileOpen(false);
              }}
              className="mt-auto flex items-center gap-2 text-gray-600 hover:text-red-600 text-sm px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} /> {t(language, "logout")}
            </button>
          </div>
        </div>
      )}

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors ${
              isActive(to) ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
