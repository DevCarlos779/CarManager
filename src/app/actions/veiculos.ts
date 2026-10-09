"use server";

import { revalidatePath } from "next/cache";
import {
  collection,
  doc,
  getDoc,
  getDocs,
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

export async function excluirVeiculo(vehicleId: string) {
  const obrigacoesSnap = await getDocs(
    collection(db, "veiculos", vehicleId, "obrigacoes"),
  );

  const batch = writeBatch(db);

  obrigacoesSnap.docs.forEach((obrigacaoDoc) => {
    batch.delete(obrigacaoDoc.ref);
  });

  batch.delete(doc(db, "veiculos", vehicleId));

  await batch.commit();

  revalidatePath("/veiculos");
}

export async function editarVeiculo(
  vehicleId: string,
  dados: Omit<Vehicle, "id">,
) {
  const { obrigacoes, ...dadosVeiculo } = dados;

  const obrigacoesRef = collection(db, "veiculos", vehicleId, "obrigacoes");
  const existentesSnap = await getDocs(obrigacoesRef);

  const existentesPorTipo = new Map(
    existentesSnap.docs.map((d) => [d.data().tipo as string, d.ref]),
  );

  const batch = writeBatch(db);

  batch.update(doc(db, "veiculos", vehicleId), dadosVeiculo);

  for (const o of obrigacoes) {
    const { id: _idDoCliente, ...dadosObrigacao } = o;
    const refExistente = existentesPorTipo.get(o.tipo);

    if (refExistente) {
      batch.update(refExistente, dadosObrigacao);
      existentesPorTipo.delete(o.tipo);
    } else {
      batch.set(doc(obrigacoesRef), dadosObrigacao);
    }
  }

  existentesPorTipo.forEach((ref) => batch.delete(ref));

  await batch.commit();

  revalidatePath("/veiculos");
  revalidatePath(`/veiculos/${vehicleId}`);
}
