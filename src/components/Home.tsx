"use client";

import { useState } from "react";
import FilterButton from "../components/FilterButton";
import SummaryCard from "../components/SummaryCard";
import VehicleCard from "../components/VehicleCard";
import { Vehicle } from "../types/typeVeiculos";

interface HomeProps {
    vehicles: Vehicle[];
}

type activeFilterType = "todos" | "atrasado" | "proximo" | "em-dia";

const statusStyles = {
  danger: {
    border: "border-l-[#DC2626]",
    badge: "bg-red-50 text-[#DC2626]",
    text: "text-[#DC2626]",
  },
  warning: {
    border: "border-l-[#F59E0B]",
    badge: "bg-amber-50 text-[#F59E0B]",
    text: "text-[#F59E0B]",
  },
  success: {
    border: "border-l-[#16A34A]",
    badge: "bg-green-50 text-[#16A34A]",
    text: "text-[#16A34A]",
  },
};

export default function Home({vehicles}: HomeProps) {

  const [activeFilter, setActiveFilter] = useState<activeFilterType>("todos");

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
    return vehicle.obrigacoes.some((obrigacao) => obrigacao.status == "atrasado");
  });

  const filteredVehiclesIsPaid = vehicles.filter((vehicle) =>
    !filteredVehiclesIsExpiry.includes(vehicle) &&
    !filteredVehiclesIsNearExpiry.includes(vehicle)
  );

  const qtdVehiclesIsNearExpiry = filteredVehiclesIsNearExpiry.length;
  const qtdVehiclesIsExpiry = filteredVehiclesIsExpiry.length;
  const qtdVehiclesIsPaid = filteredVehiclesIsPaid.length;

  const filteredVehicles =
    activeFilter === "todos" ? vehicles :
    activeFilter === "em-dia" ? filteredVehiclesIsPaid :
    activeFilter === "atrasado" ? filteredVehiclesIsExpiry :
    filteredVehiclesIsNearExpiry;
  
  return (
    <div className="min-h-screen">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold leading-tight text-[#0F172A]">
            Visão geral
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Acompanhe a situação dos seus veículos
          </p>
        </div>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total de veículos"
          value={vehicles.length}
          valueClass="text-[#0F172A]"
        />

        <SummaryCard
          title="Próximos"
          value={qtdVehiclesIsNearExpiry}
          valueClass="text-[#F59E0B]"
        />

        <SummaryCard
          title="Atrasados"
          value={qtdVehiclesIsExpiry}
          valueClass="text-[#DC2626]"
        />

        <SummaryCard
          title="Realizados"
          value={qtdVehiclesIsPaid}
          valueClass="text-[#16A34A]"
        />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-[18px] font-bold text-[#0F172A]">
            Seus veículos
          </h2>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <FilterButton active={activeFilter === "todos"} onClick={() => setActiveFilter("todos")}>
            Todos
          </FilterButton>

          <FilterButton active={activeFilter === "atrasado"} onClick={() => setActiveFilter("atrasado")}>
            Atrasados
          </FilterButton>

          <FilterButton active={activeFilter === "proximo"} onClick={() => setActiveFilter("proximo")}>
            Próximos
          </FilterButton>

          <FilterButton active={activeFilter === "em-dia"} onClick={() => setActiveFilter("em-dia")}>
            Em dia
          </FilterButton>
        </div>

        <div className="space-y-3">
            {filteredVehicles.length > 0 ?           
            filteredVehicles.map((vehicle) => {
                const obrigacao =
                vehicle.obrigacoes.find(
                    (obrigacao) => obrigacao.status === "atrasado"
                ) ??
                vehicle.obrigacoes.find(
                    (obrigacao) => obrigacao.status === "proximo"
                );

                const styles =
                obrigacao?.status === "atrasado"
                    ? statusStyles.danger
                    : obrigacao?.status === "proximo"
                    ? statusStyles.warning
                    : statusStyles.success;

                return (
                <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    styles={styles}
                />
                );
            }) : (
              <p className="py-12 text-center text-sm text-[#64748B]">
                Nenhum veiculo encontrado
              </p>)
          }
        </div>
      </section>
    </div>
  );
}

