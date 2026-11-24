import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import { LoanRequest } from "../../../lib/loan-types";

type ReceiptPageProps = { params: Promise<{ id: string }> };

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { id } = await params;
  const toolId = Number(id);
  if (!Number.isSafeInteger(toolId) || toolId < 1 || String(toolId) !== id) {
    notFound();
  }

  
  const response = await apiFetch(`/loan-requests/${toolId}`)

  if (response?.status === 404) notFound();

  const estimate: LoanRequest | null = response?.ok
    ? await response.json().catch(() => null)
    : null;

  
  // TODO FRONT-C: leer params y consultar el detalle con apiFetch.✅
  // TODO FRONT-C: mostrar ID, purpose, days y tool.name de la solicitud recibida.
  void params;

  return (
    <main>
      <h1>Loan receipt</h1>
      <Link href="/loan-requests">Back to requests</Link>
      <section className="panel">
        <h1>Loan Request #{toolId}</h1>
        <h2>{estimate?.purpose}</h2>
        <p>{estimate?.days} days</p>
      </section>
    </main>
  );
}

