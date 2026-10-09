"use client";

import Link from "next/link";
import { Vehicle } from "../types/typeVeiculos";
import { Obrigacao } from "../types/typeObrigacoes";
import { useState } from "react";
import AddVehicleModal from "./AddVehicleModal";
import { criarVeiculo } from "../app/actions/veiculos";

type Status = "atrasado" | "proximo" | "em-dia";

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  atrasado: { label: "Atrasado", className: "bg-[#FEF2F2] text-[#DC2626]" },
  proximo: { label: "Próximo", className: "bg-[#FFFBEB] text-[#F59E0B]" },
  "em-dia": { label: "Em dia", className: "bg-[#F0FDF4] text-[#16A34A]" },
};

interface VehiclesPageProps {
  vehicles: Vehicle[];
}

interface VehicleFiltered {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  renavam: string;
  chassi: string;
  cor: string;
  obrigacoes: Obrigacao[];
  status: Status;
  proximoVencimento: string;
  qtdPendencias: number;
}

interface getProximaObrigacaoReturn {
  qtdPendencias: number;
  dataProximaOrbigacao: string;
}

export default function Vehicles({ vehicles }: VehiclesPageProps) {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nome");
  const [modalAberto, setModalAberto] = useState(false);

  const filteredVehiclesIsNearExpiry = vehicles.filter((vehicle) => {
    return vehicle.obrigacoes.some((obrigacao) => {
      const [dia, mes, ano] = obrigacao.vencimento.split("/").map(Number);
      const anoCompleto = ano < 100 ? 2000 + ano : ano;
      const vencimento = new Date(anoCompleto, mes - 1, dia);

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const umMesAntes = new Date(vencimento);
      umMesAntes.setMonth(umMesAntes.getMonth() - 1);

      return hoje >= umMesAntes && hoje < vencimento;
    });
  });

  const filteredVehiclesIsExpiry = vehicles.filter((vehicle) => {
    return vehicle.obrigacoes.some(
      (obrigacao) => obrigacao.status == "atrasado",
    );
  });

  const filteredVehiclesIsPaid = vehicles.filter(
    (vehicle) =>
      !filteredVehiclesIsExpiry.includes(vehicle) &&
      !filteredVehiclesIsNearExpiry.includes(vehicle),
  );

  function getProximaObrigacao(
    vehicle: Vehicle,
  ): getProximaObrigacaoReturn | null {
    const pendentes = vehicle.obrigacoes.filter((o) => o.status === "atrasado");
    const qtdPendencias = pendentes.length;

    let dataProximaOrbigacao: string;

    if (qtdPendencias === 0) {
      dataProximaOrbigacao = vehicle.obrigacoes.reduce((maisProxima, atual) => {
        const dataAtual = parseDataBR(atual.vencimento);
        const dataMaisProxima = parseDataBR(maisProxima.vencimento);
        return dataAtual < dataMaisProxima ? atual : maisProxima;
      }).vencimento;
    } else {
      dataProximaOrbigacao = pendentes.reduce((maisProxima, atual) => {
        const dataAtual = parseDataBR(atual.vencimento);
        const dataMaisProxima = parseDataBR(maisProxima.vencimento);
        return dataAtual < dataMaisProxima ? atual : maisProxima;
      }).vencimento;
    }

    return {
      qtdPendencias,
      dataProximaOrbigacao,
    };
  }

  function verificarStatusVeiculo(vehicle: Vehicle): VehicleFiltered {
    const filteredVehicle = getProximaObrigacao(vehicle);
    if (filteredVehiclesIsExpiry.includes(vehicle)) {
      return {
        ...vehicle,
        status: "atrasado",
        proximoVencimento: filteredVehicle!.dataProximaOrbigacao,
        qtdPendencias: filteredVehicle!.qtdPendencias,
      };
    } else if (filteredVehiclesIsNearExpiry.includes(vehicle)) {
      return {
        ...vehicle,
        status: "proximo",
        proximoVencimento: filteredVehicle!.dataProximaOrbigacao,
        qtdPendencias: filteredVehicle!.qtdPendencias,
      };
    } else {
      return {
        ...vehicle,
        status: "em-dia",
        proximoVencimento: filteredVehicle!.dataProximaOrbigacao,
        qtdPendencias: filteredVehicle!.qtdPendencias,
      };
    }
  }

  const vehiclesWithStatus = vehicles.map((vehicle) =>
    verificarStatusVeiculo(vehicle),
  );

  const filteredVehicles = vehiclesWithStatus
    .filter((vehicle) => {
      const textoBusca = busca.toLowerCase().trim();

      const correspondeBusca =
        vehicle.marca.toLowerCase().includes(textoBusca) ||
        vehicle.modelo.toLowerCase().includes(textoBusca) ||
        vehicle.placa.toLowerCase().includes(textoBusca);

      const correspondeStatus =
        filtroStatus === "todos" || vehicle.status === filtroStatus;

      return correspondeBusca && correspondeStatus;
    })
    .sort((a, b) => {
      if (ordenacao === "nome") {
        return `${a.marca} ${a.modelo}`.localeCompare(
          `${b.marca} ${b.modelo}`,
          "pt-BR",
        );
      }

      return (
        parseDataBR(a.proximoVencimento).getTime() -
        parseDataBR(b.proximoVencimento).getTime()
      );
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Veículos</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Gerencie os veículos cadastrados e acompanhe suas obrigações
          </p>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="shrink-0 rounded-lg bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E3A8A]/90"
        >
          + Adicionar veículo
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          placeholder="Buscar por nome ou placa..."
          className="h-10 min-w-[220px] flex-1 rounded-lg border border-[#E2E8F0] px-3.5 text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30"
          onChange={(e) => setBusca(e.target.value)}
        />

        <select
          className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30"
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="todos">Todos os status</option>
          <option value="atrasado">Atrasado</option>
          <option value="proximo">Próximo</option>
          <option value="em-dia">Em dia</option>
        </select>

        <select
          className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30"
          onChange={(e) => setOrdenacao(e.target.value)}
        >
          <option value="nome">Ordenar por nome</option>
          <option value="vencimento">Ordenar por vencimento</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              <th className="px-4 py-3">Veículo</th>
              <th className="px-4 py-3">Ano</th>
              <th className="px-4 py-3">Placa</th>
              <th className="px-4 py-3">RENAVAM</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Próximo vencimento</th>
              <th className="px-4 py-3">Pendências</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((v) => {
              return (
                <tr
                  key={v.id}
                  className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#0F172A]">
                      {v.marca} · {v.modelo}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#0F172A]">{v.ano}</td>
                  <td className="px-4 py-3 text-[#0F172A]">{v.placa}</td>
                  <td className="px-4 py-3 text-[#0F172A]">{v.renavam}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_CONFIG[v.status].className}`}
                    >
                      {STATUS_CONFIG[v.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#0F172A]">
                    {v.proximoVencimento}
                  </td>
                  <td className="px-4 py-3 text-[#0F172A]">
                    {v.qtdPendencias}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/veiculos/${v.id}`}
                      className="font-semibold text-[#0EA5E9] hover:underline"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              );
            })}

            {filteredVehicles.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-[#64748B]"
                >
                  Nenhum veículo encontrado com esses filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddVehicleModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={async (novoVeiculo) => {
          await criarVeiculo(novoVeiculo);
        }}
      />
    </div>
  );
}

function parseDataBR(data: string): Date {
  const [dia, mes, ano] = data.split("/").map(Number);
  const anoCompleto = ano < 100 ? 2000 + ano : ano;

  return new Date(anoCompleto, mes - 1, dia);
}
