"use server";

import { revalidatePath } from "next/cache";
import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Vehicle } from "@/src/types/typeVeiculos";

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
