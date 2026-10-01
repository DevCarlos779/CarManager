import Home from "../components/Home";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Vehicle } from "../types/typeVeiculos";
import { Obrigacao } from "../types/typeObrigacoes";

export default async function Page() {
  const snapshot = await getDocs(collection(db, "veiculos"));

  const vehicles: Vehicle[] = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const obrigacoesSnapshot = await getDocs(
        collection(db, "veiculos", doc.id, "obrigacoes")
      );

      const obrigacoes: Obrigacao[] = obrigacoesSnapshot.docs.map(
        (obrigacaoDoc) => ({
          id: obrigacaoDoc.id,
          ...(obrigacaoDoc.data() as Omit<Obrigacao, "id">),
        })
      );

      return {
        id: doc.id,
        ...(doc.data() as Omit<Vehicle, "id" | "obrigacoes">),
        obrigacoes,
      };
    })
  );

  return <Home vehicles={vehicles} />;
}