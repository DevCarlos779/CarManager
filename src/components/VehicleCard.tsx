import { Car } from "lucide-react";
import Link from "next/link";
import { Vehicle } from "../types/typeVeiculos";
import { getObrigacaoMaisProxima, statusExibicao } from "../utils/obrigacoes";

const STATUS_STYLES = {
  atrasado: {
    label: "Atrasado",
    border: "border-l-[#DC2626]",
    badge: "bg-red-50 text-[#DC2626]",
    text: "text-[#DC2626]",
  },
  proximo: {
    label: "Próximo",
    border: "border-l-[#F59E0B]",
    badge: "bg-amber-50 text-[#F59E0B]",
    text: "text-[#F59E0B]",
  },
  "em-dia": {
    label: "Em dia",
    border: "border-l-[#16A34A]",
    badge: "bg-green-50 text-[#16A34A]",
    text: "text-[#16A34A]",
  },
};

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const obrigacao = getObrigacaoMaisProxima(vehicle.obrigacoes);
  const status = obrigacao ? statusExibicao(obrigacao) : "em-dia";
  const styles = STATUS_STYLES[status];

  return (
    <Link
      href={`/veiculos/${vehicle.id}`}
      className={`flex min-h-[64px] items-center gap-4 rounded-xl border border-l-4 border-[#E2E8F0] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)] ${styles.border}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F8FAFC]">
        <Car size={20} strokeWidth={1.8} className="text-[#1E3A8A]" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-[#0F172A]">
          {vehicle.modelo}
        </h3>

        <p className="mt-0.5 text-xs text-[#64748B]">
          {vehicle.placa}
          <span className="mx-1">·</span>
          RENAVAM {vehicle.renavam}
        </p>
      </div>

      <div className="flex min-w-[180px] flex-col items-end gap-1">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles.badge}`}
        >
          {styles.label}
        </span>

        <p className={`text-xs font-medium ${styles.text}`}>
          {obrigacao
            ? `${status === "atrasado" ? "venceu" : "vence"} ${obrigacao.vencimento}`
            : "Nenhuma obrigação"}
        </p>
      </div>
    </Link>
  );
}
