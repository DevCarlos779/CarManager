// components/VehicleDetails.tsx
import { notFound } from "next/navigation";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Obrigacao } from "@/src/types/typeObrigacoes";
import { Vehicle } from "@/src/types/typeVeiculos";
import VehicleDetails from "@/src/components/VehiclePage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ref = doc(db, "veiculos", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    notFound();
  }

  const obrigacoesSnapshot = await getDocs(
    collection(db, "veiculos", id, "obrigacoes"),
  );

  const obrigacoes: Obrigacao[] = obrigacoesSnapshot.docs.map(
    (obrigacaoDoc) => ({
      id: obrigacaoDoc.id,
      ...(obrigacaoDoc.data() as Omit<Obrigacao, "id">),
    }),
  );

  const vehicle: Vehicle = {
    id: snap.id,
    ...(snap.data() as Omit<Vehicle, "id" | "obrigacoes">),
    obrigacoes,
  };

  return <VehicleDetails vehicle={vehicle} />;
}
