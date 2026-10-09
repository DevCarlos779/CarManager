"use server";

import { revalidatePath } from "next/cache";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Vehicle } from "@/src/types/typeVeiculos";
import { Obrigacao } from "@/src/types/typeObrigacoes";

function formatarBR(data: Date): string {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${data.getFullYear()}`;
}

export async function criarVeiculo(novo: Omit<Vehicle, "id">) {
  const { obrigacoes, ...dadosVeiculo } = novo;

  const batch = writeBatch(db);
  const vehicleRef = doc(collection(db, "veiculos"));
  batch.set(vehicleRef, dadosVeiculo);

  for (const o of obrigacoes) {
    const { id: _idLocal, ...dados } = o;
    const obrigacaoRef = doc(
      collection(db, "veiculos", vehicleRef.id, "obrigacoes"),
    );
    batch.set(obrigacaoRef, dados);
  }

  await batch.commit();
  revalidatePath("/veiculos");
}

export async function marcarComoPago(vehicleId: string, obrigacaoId: string) {
  const ref = doc(db, "veiculos", vehicleId, "obrigacoes", obrigacaoId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Obrigação não encontrada");
  }

  const atual = snap.data() as Omit<Obrigacao, "id">;

  const [dia, mes, ano] = atual.vencimento.split("/").map(Number);
  const anoCompleto = ano < 100 ? 2000 + ano : ano;
  const novoVencimento = new Date(anoCompleto + 1, mes - 1, dia);

  await updateDoc(ref, {
    dataPagamento: formatarBR(new Date()),
    vencimento: formatarBR(novoVencimento),
    status: "em-dia",
  });

  revalidatePath(`/veiculos/${vehicleId}`);
  revalidatePath("/veiculos");
}
