/**
 * What it does: Converts an array of database telemetry rows into a downloadable CSV spreadsheet file in the browser.
 * Who uses it: Imported by `frontend/src/hooks/useGridTelemetry.js`.
 * What it talks to: Pure browser download helper (does not talk to any backend or database).
 */

export function downloadRowsAsCSV(data, filename) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(",")).join("\n");
  const csvContent = `${headers}\n${rows}`;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

