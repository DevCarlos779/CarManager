"use client";

import Link from "next/link";
import { useState } from "react";

type StatusObrigacao = "pago" | "pendente" | "proximo" | "atrasado";

type Obrigacao = {
  id: string;
  tipo: string;
  valor: number;
  vencimento: string; // formato DD/MM/AAAA
  dataPagamento: string | null;
  status: StatusObrigacao;
};

type VeiculoInfo = {
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  renavam: string;
  chassi: string;
  cor: string;
  observacoes: string;
};

// Mock: em produção isso viria de uma busca pelo params.id
const VEICULO: VeiculoInfo = {
  marca: "Honda",
  modelo: "Civic EXL",
  ano: 2021,
  placa: "PBH-2026",
  renavam: "00123456789",
  chassi: "9BW...F421",
  cor: "Prata",
  observacoes: "Revisão feita em agosto/2026.",
};

const OBRIGACOES_INICIAIS: Obrigacao[] = [
  {
    id: "1",
    tipo: "IPVA",
    valor: 1250,
    vencimento: "10/09/2026",
    dataPagamento: null,
    status: "atrasado",
  },
  {
    id: "2",
    tipo: "Licenciamento",
    valor: 180,
    vencimento: "05/10/2026",
    dataPagamento: null,
    status: "proximo",
  },
];

const STATUS_CONFIG: Record<StatusObrigacao, { label: string; className: string }> = {
  pago: { label: "Pago", className: "bg-[#F0FDF4] text-[#16A34A]" },
  pendente: { label: "Pendente", className: "bg-[#F1F5F9] text-[#64748B]" },
  proximo: { label: "Próximo", className: "bg-[#FFFBEB] text-[#F59E0B]" },
  atrasado: { label: "Atrasado", className: "bg-[#FEF2F2] text-[#DC2626]" },
};

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Nova data = mesmo dia/mês do vencimento original, no ano seguinte.
function recalcularProximoVencimento(vencimentoAtual: string) {
  const [dia, mes, ano] = vencimentoAtual.split("/");
  return `${dia}/${mes}/${Number(ano) + 1}`;
}

export default function VeiculoDetalhes() {
  const [obrigacoes, setObrigacoes] = useState(OBRIGACOES_INICIAIS);
  const [obrigacaoSelecionada, setObrigacaoSelecionada] = useState<Obrigacao | null>(null);
  const [dataPagamento, setDataPagamento] = useState("");

  function abrirModalPagamento(obrigacao: Obrigacao) {
    setObrigacaoSelecionada(obrigacao);
    setDataPagamento("");
  }

  function fecharModal() {
    setObrigacaoSelecionada(null);
  }

  function confirmarPagamento() {
    if (!obrigacaoSelecionada) return;

    const novoVencimento = recalcularProximoVencimento(obrigacaoSelecionada.vencimento);

    setObrigacoes(
      obrigacoes.map((obrigacao) =>
        obrigacao.id === obrigacaoSelecionada.id
          ? {
              ...obrigacao,
              status: "pago",
              dataPagamento,
              vencimento: novoVencimento,
            }
          : obrigacao
      )
    );

    fecharModal();
  }

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
          {VEICULO.marca} {VEICULO.modelo}
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          {VEICULO.placa} · Ano {VEICULO.ano}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
        <div>
          <div className="text-xs uppercase text-[#64748B]">Marca</div>
          <div className="text-sm font-semibold text-[#0F172A]">{VEICULO.marca}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-[#64748B]">Modelo</div>
          <div className="text-sm font-semibold text-[#0F172A]">{VEICULO.modelo}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-[#64748B]">Cor</div>
          <div className="text-sm font-semibold text-[#0F172A]">{VEICULO.cor}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-[#64748B]">Placa</div>
          <div className="text-sm font-semibold text-[#0F172A]">{VEICULO.placa}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-[#64748B]">RENAVAM</div>
          <div className="text-sm font-semibold text-[#0F172A]">{VEICULO.renavam}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-[#64748B]">Chassi</div>
          <div className="text-sm font-semibold text-[#0F172A]">{VEICULO.chassi}</div>
        </div>
        {VEICULO.observacoes && (
          <div className="col-span-3">
            <div className="text-xs uppercase text-[#64748B]">Observações</div>
            <div className="text-sm text-[#0F172A]">{VEICULO.observacoes}</div>
          </div>
        )}
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
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Data de pagamento</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {obrigacoes.map((obrigacao) => (
                <tr key={obrigacao.id} className="border-b border-[#E2E8F0] last:border-0">
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">{obrigacao.tipo}</td>
                  <td className="px-4 py-3 text-[#0F172A]">{formatarMoeda(obrigacao.valor)}</td>
                  <td className="px-4 py-3 text-[#0F172A]">{obrigacao.vencimento}</td>
                  <td className="px-4 py-3 text-[#0F172A]">{obrigacao.dataPagamento ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_CONFIG[obrigacao.status].className}`}>
                      {STATUS_CONFIG[obrigacao.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {obrigacao.status !== "pago" && (
                      <button
                        onClick={() => abrirModalPagamento(obrigacao)}
                        className="font-semibold text-[#0EA5E9] hover:underline"
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

      {obrigacaoSelecionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/45">
          <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-extrabold text-[#0F172A]">
              Marcar {obrigacaoSelecionada.tipo} como pago
            </h3>
            <p className="mb-4 text-sm text-[#64748B]">
              {VEICULO.marca} {VEICULO.modelo} · {VEICULO.placa}
            </p>

            <label className="mb-1 block text-xs font-semibold text-[#64748B]">
              Data do pagamento
            </label>
            <input
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              className="mb-4 h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm"
            />

            <div className="mb-5 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] p-4">
              <div className="text-xs font-bold uppercase text-[#16A34A]">
                Próximo vencimento recalculado
              </div>
              <div className="mt-1 text-xl font-extrabold text-[#0F172A]">
                {recalcularProximoVencimento(obrigacaoSelecionada.vencimento)}
              </div>
              <div className="mt-2 text-xs text-[#64748B]">
                Renovação anual: nova data = mesmo dia/mês do vencimento
                original, no ano seguinte.
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={fecharModal}
                className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#0F172A]"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarPagamento}
                disabled={!dataPagamento}
                className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Confirmar pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
