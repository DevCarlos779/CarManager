"use client";

import { useState } from "react";
import Modal from "./Modal";
import { Vehicle } from "../types/typeVeiculos";
import { Obrigacao } from "../types/typeObrigacoes";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Omit<Vehicle, "id">) => void;
}

export default function AddVehicleModal({
  isOpen,
  onClose,
  onSave,
}: AddVehicleModalProps) {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [cor, setCor] = useState("");
  const [renavam, setRenavam] = useState("");
  const [ano, setAno] = useState(0);
  const [pagaIPVA, setPagaIPVA] = useState<boolean | null>(null);
  const [dataIPVA, setDataIPVA] = useState("");
  const [foiPagoUltimoIPVA, setFoiPagoUltimoIPVA] = useState(false);
  const [dataLicenciamento, setDataLicenciamento] = useState("");
  const [foiPagoUltimoLicenciamento, setFoiPagoUltimoLicenciamento] =
    useState(false);

  const [erro, setErro] = useState("");

  function formatarData(data: string): string {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function calcularStatus(
    dataISO: string,
    foiPago: boolean,
  ): Obrigacao["status"] {
    if (foiPago) return "em-dia";

    const [ano, mes, dia] = dataISO.split("-").map(Number);
    const vencimento = new Date(ano, mes - 1, dia);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return hoje > vencimento ? "atrasado" : "em-dia";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (pagaIPVA) {
      if (
        !marca.trim() ||
        !modelo.trim() ||
        !placa.trim() ||
        !renavam.trim() ||
        !ano ||
        !dataIPVA ||
        !dataLicenciamento
      ) {
        setErro(
          "Preencha marca, modelo, placa, renavam, ano, data IPVA e data de licenciamento.",
        );
        return;
      }
    } else {
      if (
        !marca.trim() ||
        !modelo.trim() ||
        !placa.trim() ||
        !renavam.trim() ||
        !ano ||
        !dataLicenciamento
      ) {
        setErro(
          "Preencha marca, modelo, placa, renavam, ano e data de licenciamento.",
        );
        return;
      }
    }

    let obrigacoes: Obrigacao[];

    if (pagaIPVA) {
      obrigacoes = [
        {
          id: crypto.randomUUID(),
          tipo: "IPVA",
          vencimento: formatarData(dataIPVA),
          dataPagamento: null,
          status: calcularStatus(dataIPVA, foiPagoUltimoIPVA),
        },
        {
          id: crypto.randomUUID(),
          tipo: "Licenciamento",
          vencimento: formatarData(dataLicenciamento),
          dataPagamento: null,
          status: calcularStatus(dataIPVA, foiPagoUltimoIPVA),
        },
      ];
    } else {
      obrigacoes = [
        {
          id: crypto.randomUUID(),
          tipo: "Licenciamento",
          vencimento: formatarData(dataLicenciamento),
          dataPagamento: null,
          status: calcularStatus(dataIPVA, foiPagoUltimoIPVA),
        },
      ];
    }

    onSave({ marca, modelo, placa, renavam, ano, cor, obrigacoes } as Omit<
      Vehicle,
      "id"
    >);

    console.log(dataIPVA);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar veículo">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {erro && <p className="text-sm text-[#DC2626]">{erro}</p>}

        <input
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          placeholder="Marca"
          className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm"
        />
        <input
          required
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          placeholder="Modelo"
          className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm"
        />
        <input
          required
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          placeholder="Placa"
          className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm"
        />

        <input
          required
          value={renavam}
          onChange={(e) => setRenavam(e.target.value)}
          placeholder="Renavam"
          className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm"
        />

        <input
          value={cor}
          onChange={(e) => setCor(e.target.value)}
          placeholder="Cor"
          className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm"
        />

        <input
          required
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
          placeholder="Cor"
          className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm"
        />

        <div>
          <p className="mb-1.5 text-sm font-medium text-[#0F172A]">
            Paga IPVA?
          </p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-[#0F172A]">
              <input
                type="radio"
                name="pagaIPVA"
                checked={pagaIPVA === true}
                onChange={() => setPagaIPVA(true)}
              />
              Sim
            </label>
            <label className="flex items-center gap-2 text-sm text-[#0F172A]">
              <input
                type="radio"
                name="pagaIPVA"
                checked={pagaIPVA === false}
                onChange={() => setPagaIPVA(false)}
              />
              Não
            </label>
          </div>
        </div>

        {pagaIPVA === true && (
          <>
            <input
              required
              type="date"
              value={dataIPVA}
              onChange={(e) => setDataIPVA(e.target.value.toString())}
              className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm"
            />

            <div>
              <p className="mb-1.5 text-sm font-medium text-[#0F172A]">
                Este IPVA já foi pago?
              </p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-[#0F172A]">
                  <input
                    type="radio"
                    name="pagaIPVA"
                    checked={foiPagoUltimoIPVA === true}
                    onChange={() => setFoiPagoUltimoIPVA(true)}
                  />
                  Sim
                </label>
                <label className="flex items-center gap-2 text-sm text-[#0F172A]">
                  <input
                    type="radio"
                    name="foiPagoUltimoIPVA"
                    checked={foiPagoUltimoIPVA === false}
                    onChange={() => setFoiPagoUltimoIPVA(false)}
                  />
                  Não
                </label>
              </div>
            </div>
          </>
        )}

        <label className="flex items-center gap-2 text-sm text-[#0F172A]">
          Data Licenciamento
        </label>

        <input
          required
          type="date"
          value={dataLicenciamento}
          onChange={(e) => setDataLicenciamento(e.target.value.toString())}
          className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm"
        />

        <div>
          <p className="mb-1.5 text-sm font-medium text-[#0F172A]">
            Este Licenciamento já foi pago?
          </p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-[#0F172A]">
              <input
                type="radio"
                name="pagaIPVA"
                checked={foiPagoUltimoLicenciamento === true}
                onChange={() => setFoiPagoUltimoLicenciamento(true)}
              />
              Sim
            </label>
            <label className="flex items-center gap-2 text-sm text-[#0F172A]">
              <input
                type="radio"
                name="foiPagoUltimoIPVA"
                checked={foiPagoUltimoLicenciamento === false}
                onChange={() => setFoiPagoUltimoLicenciamento(false)}
              />
              Não
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 h-10 rounded-lg bg-[#1E3A8A] text-sm font-semibold text-white"
        >
          Salvar
        </button>
      </form>
    </Modal>
  );
}
