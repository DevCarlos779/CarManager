"use client";

import { useState } from "react";
import Modal from "./Modal";
import { Vehicle } from "../types/typeVeiculos";

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
  const [dataLicenciamento, setDataLicenciamento] = useState("");

  const [erro, setErro] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !marca.trim() ||
      !modelo.trim() ||
      !placa.trim() ||
      !renavam.trim() ||
      !ano
    ) {
      setErro("Preencha marca, modelo, placa, renavam e ano.");
      return;
    }

    onSave({ marca, modelo, placa, renavam, ano, cor } as Omit<Vehicle, "id">);
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
          <input
            required
            type="date"
            value={dataIPVA}
            onChange={(e) => setDataIPVA(e.target.value.toString())}
            className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm"
          />
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
