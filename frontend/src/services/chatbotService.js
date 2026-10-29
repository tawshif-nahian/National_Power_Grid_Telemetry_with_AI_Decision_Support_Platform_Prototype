/**
 * What it does: Sends natural-language grid questions to the AI assistant or returns a local fallback answer.
 * Who uses it: Imported by the chatbot component (`ChatbotWidget.jsx`) and parked AI Assistant page.
 * What it talks to: Calls the external AI API using `ENV.GEMINI_API_KEY` from `frontend/src/config/env.js`.
 */

import { ENV } from "../config/env";
import { computePlantCosts } from "../utils/costCalculations";

// SECURITY: this key is visible in the browser. Do not use in production.
// In a future phase, chatbot requests will call `backend/supabase/functions/chat` instead.
export async function sendChatbotPrompt({
  userMessage,
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
  const gridContext = `Total Gen: ${totalPower.toFixed(1)} MW / ${totalCapacity} MW (${nationalPlf}% PLF). Payra Coal: ${coalPower} MW ($${computePlantCosts(plants[0]).variableCostKwh.toFixed(4)}/kWh, 6.5d stock). Titas Gas: ${gasPower} MW ($${computePlantCosts(plants[1]).variableCostKwh.toFixed(4)}/kWh, 3.8d stock, 412.5 PSI). Sirajganj Solar: ${solarPower} MW ($0.0008/kWh). Grid Freq: ${currentFreq} Hz.`;

  try {
    if (ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.length > 10) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${ENV.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are the AI Grid Operator Assistant for the National Power Portal. Answer concisely using this live data:\n${gridContext}\n\nQuestion: ${userMessage}`,
                  },
                ],
              },
            ],
          }),
        }
      );
      const json = await res.json();
      const reply =
        json?.candidates?.[0]?.content?.parts?.[0]?.text ||
        generateDomainFallbackReply(userMessage, {
          plants,
          weightedCostMwh,
          currentFreq,
          deltaF,
          totalPower,
          totalCapacity,
          nationalPlf,
          cleanEnergyShare,
        });
      return reply;
    }
  } catch {
    // Fall through to domain fallback reply
  }

  return generateDomainFallbackReply(userMessage, {
    plants,
    weightedCostMwh,
    currentFreq,
    deltaF,
    totalPower,
    totalCapacity,
    nationalPlf,
    cleanEnergyShare,
  });
}

export function generateDomainFallbackReply(
  q,
  {
    plants,
    weightedCostMwh,
    currentFreq,
    deltaF,
    totalPower,
    totalCapacity,
    nationalPlf,
    cleanEnergyShare,
  }
) {
  const lower = q.toLowerCase();
  const coalCost = computePlantCosts(plants[0]).variableCostKwh.toFixed(4);
  const gasCost = computePlantCosts(plants[1]).variableCostKwh.toFixed(4);
  const solarCost = computePlantCosts(plants[2]).variableCostKwh.toFixed(4);

  if (
    lower.includes("cost") ||
    lower.includes("merit") ||
    lower.includes("price") ||
    lower.includes("kwh")
  ) {
    return `Merit-Order Dispatch Cost Ranking: 1) Sirajganj Solar PV ($${solarCost}/kWh), 2) Titas 450 MW CCGT Gas ($${gasCost}/kWh), 3) Payra 1320 MW Ultra-Supercritical Coal ($${coalCost}/kWh). Weighted national generation cost is currently $${weightedCostMwh}/MWh.`;
  }
  if (
    lower.includes("fuel") ||
    lower.includes("inventory") ||
    lower.includes("coal") ||
    lower.includes("gas")
  ) {
    return `Fuel Logistics Status: Titas Gas Station is in SUPER-CRITICAL reserve state (3.8 days, 412.5 PSI). Payra Thermal Coal is in CRITICAL state (74,500 MT, 6.5 days of burn; resupply vessel ETA 48 hours).`;
  }
  if (
    lower.includes("freq") ||
    lower.includes("voltage") ||
    lower.includes("hz")
  ) {
    return `Grid Stability: System frequency is synchronized at ${currentFreq.toFixed(2)} Hz (Δf = ${deltaF} Hz). Substation voltages are nominal at 400 kV (Payra), 230 kV (Titas), and 132 kV (Sirajganj).`;
  }
  return `National Grid Summary: Total active generation is ${totalPower.toFixed(1)} MW across ${totalCapacity} MW installed capacity (${nationalPlf}% utilization). Renewable share is ${cleanEnergyShare}% and system frequency is ${currentFreq.toFixed(2)} Hz.`;
}

