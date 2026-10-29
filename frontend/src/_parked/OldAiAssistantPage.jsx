// Parked: not in the menu yet.
/**
 * What it does: Preserves the original Economic Merit-Order Dispatch Ranking & AI Assistant page from App.jsx.
 * Who uses it: Currently parked in `_parked/` so no code is deleted.
 * What it talks to: Calls `sendChatbotPrompt` in `../services/chatbotService.js` and `computePlantCosts` in `../utils/costCalculations.js`.
 */

import { useState } from "react";
import { Send } from "lucide-react";
import { computePlantCosts } from "../utils/costCalculations";
import { sendChatbotPrompt } from "../services/chatbotService";

export default function OldAiAssistantPage({
  plants,
  totalPower,
  totalCapacity,
  nationalPlf,
  coalPower,
  gasPower,
  solarPower,
  currentFreq,
  deltaF,
  weightedCostMwh,
  cleanEnergyShare,
}) {
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Welcome to the National Power Portal AI Decision-Support Assistant. Ask me about live generation (MW), grid frequency (Hz), merit-order costs ($/kWh), or fuel stock alerts.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const reply = await sendChatbotPrompt({
        userMessage: userMsg,
        plants,
        totalPower,
        totalCapacity,
        nationalPlf,
        coalPower,
        gasPower,
        solarPower,
        currentFreq,
        deltaF,
        weightedCostMwh,
        cleanEnergyShare,
      });
      setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900">
          Economic Merit-Order Dispatch Ranking
        </h2>
        <p className="text-xs text-slate-500">
          Units ranked by lowest short-run marginal cost ($/kWh) for optimal
          dispatch.
        </p>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Station</th>
              <th className="p-3">Cost ($/kWh)</th>
              <th className="p-3">Dispatch Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...plants]
              .sort(
                (a, b) =>
                  computePlantCosts(a).variableCostKwh -
                  computePlantCosts(b).variableCostKwh
              )
              .map((p, idx) => (
                <tr key={p.id}>
                  <td className="p-3 font-mono font-bold text-[#1D4ED8]">
                    #{idx + 1}
                  </td>
                  <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">
                    ${computePlantCosts(p).variableCostKwh.toFixed(4)}
                  </td>
                  <td className="p-3 text-slate-600">
                    {idx === 0
                      ? "100% Base Priority"
                      : idx === 1
                        ? "Intermediate Load-Following"
                        : "Thermal Base Support"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl flex flex-col h-[460px] shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Google Gemini Operational Grid Assistant
            </h3>
            <p className="text-[11px] text-slate-500">
              Natural-language decision support for grid conditions
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#1D4ED8] border border-blue-200">
            AI READY
          </span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/50">
          {chatMessages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg leading-relaxed ${
                m.role === "user"
                  ? "bg-[#1D4ED8] text-white ml-8"
                  : "bg-white border border-slate-200 text-slate-800 mr-8"
              }`}
            >
              {m.text}
            </div>
          ))}
          {isChatLoading && (
            <div className="text-xs text-slate-500 font-mono">
              Evaluating grid telemetry...
            </div>
          )}
        </div>

        <form
          onSubmit={handleSendChat}
          className="p-3 border-t border-slate-200 flex gap-2 bg-white"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about $/kWh cost, coal stock, or grid frequency..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#1D4ED8]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

