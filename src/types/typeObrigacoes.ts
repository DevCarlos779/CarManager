export interface Obrigacao {
  id: string;
  tipo: "IPVA" | "Licenciamento";
  valor: number;
  vencimento: string;
  dataPagamento: string | null;
  status: "atrasado" | "proximo" | "pago";
}
