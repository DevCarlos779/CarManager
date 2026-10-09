"use client";

import Link from "next/link";
import { Vehicle } from "../types/typeVeiculos";
import { Obrigacao } from "../types/typeObrigacoes";
import { marcarComoPago } from "../app/actions/veiculos";

type StatusObrigacao = "em-dia" | "proximo" | "atrasado";

const STATUS_CONFIG: Record<
  StatusObrigacao,
  { label: string; className: string }
> = {
  "em-dia": { label: "Em dia", className: "bg-[#F0FDF4] text-[#16A34A]" },
  proximo: { label: "Próximo", className: "bg-[#FFFBEB] text-[#F59E0B]" },
  atrasado: { label: "Atrasado", className: "bg-[#FEF2F2] text-[#DC2626]" },
};

interface VehicleDetails {
  vehicle: Vehicle;
}

export default function VehicleDetails({ vehicle }: VehicleDetails) {
  function calcularStatus(obrigacao: Obrigacao) {
    const [dia, mes, ano] = obrigacao.vencimento.split("/").map(Number);
    const anoCompleto = ano < 100 ? 2000 + ano : ano;
    const vencimento = new Date(anoCompleto, mes - 1, dia);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const umMesAntes = new Date(vencimento);
    umMesAntes.setMonth(umMesAntes.getMonth() - 1);

    let statusFormatado: StatusObrigacao;

    if (hoje < umMesAntes) {
      statusFormatado = "em-dia";
    } else if (hoje > vencimento) {
      statusFormatado = "atrasado";
    } else {
      statusFormatado = "proximo";
    }

    const obrigacaoFormatada = {
      ...obrigacao,
      status: statusFormatado,
    };

    return obrigacaoFormatada;
  }

  const arrayObrigacoesFormatadas = vehicle.obrigacoes.map((obrigacao) => {
    console.log(obrigacao);
    return calcularStatus(obrigacao);
  });

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/veiculos"
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-[#64748B] hover:text-[#0F172A]"
      >
        ← Voltar para veículos
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A]">
          {vehicle.marca} {vehicle.modelo}
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          {vehicle.placa} · Ano {vehicle.ano}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
        <div>
          <div className="text-xs uppercase text-[#64748B]">Marca</div>
          <div className="text-sm font-semibold text-[#0F172A]">
            {vehicle.marca}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-[#64748B]">Modelo</div>
          <div className="text-sm font-semibold text-[#0F172A]">
            {vehicle.modelo}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-[#64748B]">Cor</div>
          <div className="text-sm font-semibold text-[#0F172A]">
            {vehicle.cor}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-[#64748B]">Placa</div>
          <div className="text-sm font-semibold text-[#0F172A]">
            {vehicle.placa}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-[#64748B]">RENAVAM</div>
          <div className="text-sm font-semibold text-[#0F172A]">
            {vehicle.renavam}
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-base font-bold text-[#0F172A]">
          Obrigações e pagamentos
        </h2>

        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Data de pagamento</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {arrayObrigacoesFormatadas.map((obrigacao) => (
                <tr
                  key={obrigacao.id}
                  className="border-b border-[#E2E8F0] last:border-0"
                >
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">
                    {obrigacao.tipo}
                  </td>
                  <td className="px-4 py-3 text-[#0F172A]">
                    {obrigacao.vencimento}
                  </td>
                  <td className="px-4 py-3 text-[#0F172A]">
                    {obrigacao.dataPagamento ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_CONFIG[obrigacao.status].className}`}
                    >
                      {STATUS_CONFIG[obrigacao.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {obrigacao.status !== "em-dia" && (
                      <button
                        onClick={() => marcarComoPago(vehicle.id, obrigacao.id)}
                        className="font-semibold text-[#0EA5E9] hover:underline cursor-pointer"
                      >
                        Marcar como pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
