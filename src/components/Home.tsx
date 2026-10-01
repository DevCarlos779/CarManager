import FilterButton from "../components/FilterButton";
import SummaryCard from "../components/SummaryCard";
import VehicleCard from "../components/VehicleCard";
import { Vehicle } from "../types/typeVeiculos";

interface HomeProps {
    vehicles: Vehicle[];
}

// export interface vehicle {
//  id: number;
//  name: string;
//  plate: string;
//  renavam: string;
//  status: string;
//  type: string;
//  date: string;
//  color: string;
// };

// const vehicles: vehicle[] = [
//   {
//     id: 1,
//     name: "Honda Civic",
//     plate: "PBH-2026",
//     renavam: "00123456789",
//     status: "Atrasado",
//     type: "IPVA",
//     date: "10/09",
//     color: "danger",
//   },
//   {
//     id: 2,
//     name: "Toyota Corolla",
//     plate: "TCR-1010",
//     renavam: "00987654321",
//     status: "Próximo",
//     type: "Licenciamento",
//     date: "05/10",
//     color: "warning",
//   },
//   {
//     id: 3,
//     name: "Fiat Argo",
//     plate: "FAR-3030",
//     renavam: "00555999111",
//     status: "Em dia",
//     type: "",
//     date: "Próximo em 90 dias",
//     color: "success",
//   },
// ];

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

        <button className="flex h-10 items-center rounded-lg bg-[#1E3A8A] px-4 text-sm font-semibold text-white transition hover:bg-[#172F70]">
          + Adicionar veículo
        </button>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total de veículos"
          value="4"
          valueClass="text-[#0F172A]"
        />

        <SummaryCard
          title="Próximos"
          value="2"
          valueClass="text-[#F59E0B]"
        />

        <SummaryCard
          title="Atrasados"
          value="1"
          valueClass="text-[#DC2626]"
        />

        <SummaryCard
          title="Realizados"
          value="8"
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
          <FilterButton active>
            Todos
          </FilterButton>

          <FilterButton>
            Atrasados
          </FilterButton>

          <FilterButton>
            Próximos
          </FilterButton>

          <FilterButton>
            Em dia
          </FilterButton>
        </div>

        <div className="space-y-3">
            {vehicles.map((vehicle) => {
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
            })}
        </div>
      </section>
    </div>
  );
}

