import Vehicles from "@/src/components/Vehicles";
import { db } from "@/src/lib/firebase";
import { Obrigacao } from "@/src/types/typeObrigacoes";
import { Vehicle } from "@/src/types/typeVeiculos";
import { collection, getDocs } from "firebase/firestore";

export default async function Page() {
    //requisição
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

    return <Vehicles vehicles={vehicles} />;
}