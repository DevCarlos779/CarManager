import { Car, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Vehicle } from "../types/typeVeiculos";

export default function VehicleCard({
  vehicle,
  styles
}: {
  vehicle: Vehicle;
  styles: {
    border: string;
    badge: string;
    text: string;
  };
}) {

  const obrigacao = vehicle.obrigacoes.find(
    (obrigacao) => obrigacao.status === "atrasado"
  ) ?? vehicle.obrigacoes.find(
    (obrigacao) => obrigacao.status === "proximo"
  );

  return (
    <Link href={`/veiculos/${vehicle.id}`}
      className={`flex min-h-[64px] items-center gap-4 rounded-xl border border-[#E2E8F0] border-l-4 bg-white px-4 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)] ${styles.border}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F8FAFC]">
        <Car
          size={20}
          strokeWidth={1.8}
          className="text-[#1E3A8A]"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-bold text-[#0F172A]">
            {vehicle.modelo}
          </h3>
        </div>

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
          {obrigacao?.status}
        </span>

        <p className={`text-xs font-medium ${styles.text}`}>
          {obrigacao
            ? `${
                obrigacao.status === "atrasado" ? "venceu" : "vence"
              } ${obrigacao.vencimento}`
            : "Nenhuma obrigação"}
        </p>
      </div>
    
    </Link>
  );
}