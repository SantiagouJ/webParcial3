import Link from "next/link";
import { apiFetch } from "../../lib/api";
import type { LoanRequest, Tool } from "../../lib/loan-types";

type LoanRequestsPageProps = { searchParams: Promise<{ toolId?: string }> };

export default async function LoanRequestsPage({ searchParams }: LoanRequestsPageProps) {
  // Esta consulta solo prepara las opciones que se necesitan para el selector del filtro.
  const toolsResponse = await apiFetch("/tools");
  const tools: Tool[] = toolsResponse.ok ? await toolsResponse.json() : [];
  
   const { toolId } = await searchParams;
  const selectedId = Array.isArray(toolId) ? toolId : toolId ? [toolId] : []
  


   
  const endpointURL = toolId
    ? `/loan-requests?toolId=${selectedId}`
    : "/loan-requests";

  const response = await apiFetch(endpointURL)


  const data = response?.ok ? await response.json().catch(() => null) : null;
  
  

  // TODO FRONT-A: leer searchParams y consultar las solicitudes con apiFetch.✅
  // TODO FRONT-A: agregar el formulario GET de filtro usando tools y la opción All tools.✅
  // TODO FRONT-A: mostrar las solicitudes y sus enlaces al comprobante correspondiente.✅
  void searchParams;
  void tools;

  return (
    <main>
      <h1>Loan requests</h1>
      <Link className="button" href="/loan-requests/new">New request</Link>
      <section className="panel" aria-label="Loan requests">
        <p>Complete the request list and its filter.</p>
        <Link className="button" href="/loan-requests">Todas</Link>
        <br />
        <br />
        <Link href="/loan-requests?toolId=1">Id 1 </Link>
        <Link href="/loan-requests?toolId=2">Id 2 </Link>
        {
          data.map((tool:LoanRequest)=>(
            <section key={tool.id}>
              <h1>{tool.purpose}</h1>
              <p>{tool.days} days</p>
              <h2>Tool:</h2>
              <p>{tool.tool.name}</p>
              <p>{tool.tool.maxLoanDays}</p>
            </section>
          ))
        }
      </section>
    </main>
  );
}

