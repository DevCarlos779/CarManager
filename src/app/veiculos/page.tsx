"use client";

import Link from "next/link";
import { useState } from "react";

type Status = "atrasado" | "proximo" | "em-dia";

type Vehicle = {
  id: string;
  nome: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  renavam: string;
  status: Status;
  proximoVencimento: string;
  pendencias: number;
};

const MOCK_VEICULOS: Vehicle[] = [
  {
    id: "1",
    nome: "Honda Civic",
    marca: "Honda",
    modelo: "Civic EXL",
    ano: 2021,
    placa: "PBH-2026",
    renavam: "00123456789",
    status: "atrasado",
    proximoVencimento: "10/09/2026",
    pendencias: 1,
  },
  {
    id: "2",
    nome: "Toyota Corolla",
    marca: "Toyota",
    modelo: "Corolla XEI",
    ano: 2022,
    placa: "TCR-1010",
    renavam: "00987654321",
    status: "proximo",
    proximoVencimento: "05/10/2026",
    pendencias: 1,
  },
  {
    id: "3",
    nome: "Fiat Argo",
    marca: "Fiat",
    modelo: "Argo Drive",
    ano: 2020,
    placa: "FAR-3030",
    renavam: "00555999111",
    status: "em-dia",
    proximoVencimento: "18/12/2026",
    pendencias: 0,
  },
  {
    id: "4",
    nome: "Chevrolet Onix",
    marca: "Chevrolet",
    modelo: "Onix LT",
    ano: 2023,
    placa: "CHO-4040",
    renavam: "00222333444",
    status: "em-dia",
    proximoVencimento: "02/02/2027",
    pendencias: 0,
  },
];

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  atrasado: { label: "Atrasado", className: "bg-[#FEF2F2] text-[#DC2626]" },
  proximo: { label: "Próximo", className: "bg-[#FFFBEB] text-[#F59E0B]" },
  "em-dia": { label: "Em dia", className: "bg-[#F0FDF4] text-[#16A34A]" },
};

export default function Veiculos() {

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">
            Veículos
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Gerencie os veículos cadastrados e acompanhe suas obrigações
          </p>
        </div>

        <Link
          href="/veiculos/novo"
          className="shrink-0 rounded-lg bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E3A8A]/90"
        >
          + Adicionar veículo
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          placeholder="Buscar por nome ou placa..."
          className="h-10 min-w-[220px] flex-1 rounded-lg border border-[#E2E8F0] px-3.5 text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30"
        />

        <select
          className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30"
        >
          <option value="todos">Todos os status</option>
          <option value="atrasado">Atrasado</option>
          <option value="proximo">Próximo</option>
          <option value="em-dia">Em dia</option>
        </select>

        <select
          className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30"
        >
          <option value="todos">Com ou sem pendência</option>
          <option value="com-pendencia">Com pendência</option>
          <option value="sem-pendencia">Sem pendência</option>
        </select>

        <select
          className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30"
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
            {MOCK_VEICULOS.map((v) => (
              <tr
                key={v.id}
                className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-[#0F172A]">{v.nome}</div>
                  <div className="text-xs text-[#64748B]">
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
                <td className="px-4 py-3 text-[#0F172A]">{v.pendencias}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/veiculos/${v.id}`}
                    className="font-semibold text-[#0EA5E9] hover:underline"
                  >
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            ))}

            {MOCK_VEICULOS.length === 0 && (
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
    </div>
  );
}
