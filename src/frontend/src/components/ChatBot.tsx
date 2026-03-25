import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";

interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
}

const RESPONSES: Record<string, string> = {
  diabetes:
    "Diabetes is a chronic condition where the body cannot properly regulate blood sugar. Type 1 is autoimmune; Type 2 is lifestyle-related. Symptoms include frequent urination, excessive thirst, fatigue, and blurred vision.",
  hyperglycemia:
    "Hyperglycemia means high blood sugar. It can cause fatigue, frequent urination, headaches, and blurred vision. Persistent hyperglycemia may lead to diabetes complications.",
  hypertension:
    "Hypertension (high blood pressure) is when blood pressure consistently reads above 130/80 mmHg. It often has no symptoms but increases risk of heart attack and stroke.",
  "high blood pressure":
    "High blood pressure (hypertension) is a major risk factor for heart disease and stroke. Lifestyle changes and medication can help manage it.",
  anemia:
    "Anemia occurs when you have fewer red blood cells or less hemoglobin than normal. Symptoms include fatigue, weakness, pale skin, and shortness of breath.",
  cholesterol:
    "High cholesterol means too much LDL (bad cholesterol) in the blood. It can build up in arteries and increase heart disease and stroke risk. Diet changes and statins are common treatments.",
  thyroid:
    "Thyroid disorders affect how your thyroid gland produces hormones. Hypothyroidism (underactive) causes fatigue and weight gain. Hyperthyroidism (overactive) causes weight loss and anxiety.",
  kidney:
    "Kidney disease can be caused by diabetes, high blood pressure, or infections. Symptoms in early stages are often absent. Creatinine levels in blood tests help detect kidney function.",
  liver:
    "Liver disease can be caused by alcohol, viral hepatitis, or fatty deposits. Elevated ALT/AST levels in blood tests may indicate liver inflammation or damage.",
  symptoms:
    "Common symptoms to watch for: fatigue, unexplained weight changes, increased thirst or urination, chest pain, shortness of breath, and frequent infections.",
  treatment:
    "For specific treatments, please refer to the Recommendations section in your analysis results. Always consult a licensed doctor before starting any treatment.",
  medicine:
    "Your analysis results show recommended generic medicines. These are for educational reference only. Always get a prescription from a licensed healthcare provider.",
  doctor:
    "It is very important to consult a licensed medical professional for any health concerns. This AI analysis is educational only and cannot replace professional medical advice.",
  help: "I can answer questions about common conditions like diabetes, hypertension, anemia, cholesterol, thyroid disorders, kidney, and liver issues. Just ask!",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return "I can answer questions about detected conditions. Try asking about diabetes, hypertension, anemia, cholesterol, thyroid, kidney, or liver conditions. For medical advice, always consult a doctor.";
}

export function ChatBot() {
  const { language: _language } = useAppContext();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      from: "bot",
      text: "Hi! I can answer questions about common medical conditions. Ask me about diabetes, hypertension, anemia, cholesterol, or other detected conditions.",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const msgCount = messages.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when message count changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgCount]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const ts = Date.now().toString();
    const userMsg: Message = { id: `u-${ts}`, from: "user", text };
    const botMsg: Message = {
      id: `b-${ts}`,
      from: "bot",
      text: getBotResponse(text),
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div
          className="mb-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: "420px" }}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <span className="font-semibold text-sm">
                HealthScan Assistant
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    msg.from === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="flex gap-2 p-3 border-t border-gray-200 bg-white">
            <input
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask about a condition..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              type="button"
              onClick={sendMessage}
              className="bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700 transition-colors"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        aria-label="Open chat assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
