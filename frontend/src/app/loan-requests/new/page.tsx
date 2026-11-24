import Link from "next/link";
import { apiFetch } from "../../../lib/api";
import type { Tool } from "../../../lib/loan-types";
import { redirect } from "next/navigation";

async function createLoanRequest(formData: FormData) {
  "use server";

  // TODO FRONT-B: leer el formulario, convertir los números y enviar el POST con apiFetch.
  const response = await apiFetch("/loan-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      purpose: String(formData.get("purpose") ?? "").trim(),
      days: Number(formData.get("days")),
      toolId: Number(formData.get("toolId")),
    }),
  });
  void formData;

  const loanrequst = await response.json().catch(() => null);
  const id = loanrequst?.id;
  if (typeof id !== "number" || !Number.isSafeInteger(id) || id < 1) {
    redirect("/loan-requests/new?error=receipt");
  }

  redirect(`/loan-requests/${id}`);
  // TODO FRONT-B: si se crea la solicitud, abrir el comprobante con el ID recibido.✅
  // Si la creación se rechaza, no redirigir a un comprobante.✅
}

export default async function NewLoanRequestPage() {
  const response = await apiFetch("/tools");
  const tools: Tool[] = response.ok ? await response.json() : [];

  return (
    <main>
      <h1>New loan request</h1>
      <Link href="/loan-requests">Back to requests</Link>
      <form className="panel fields" action={createLoanRequest}>
        <label>Purpose<input name="purpose" maxLength={120} required /></label>
        <label>Days<input name="days" type="number" min={1} step={1} required /></label>
        <label>
          Tool
          <select name="toolId" defaultValue="" required>
            <option value="" disabled>Select a tool</option>
            {tools.map((tool) => (
              <option key={tool.id} value={tool.id}>{tool.name} — maximum {tool.maxLoanDays} days</option>
            ))}
          </select>
        </label>
        <button type="submit">Send request</button>
      </form>
    </main>
  );
}

