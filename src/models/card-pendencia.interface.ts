export interface ApprovalCardData {
  idDocumento: number;
  numeroProtocolo: string | null;
  nome: string;
  modulo: string;
  status: 'Aguardando aprovação' | 'Aprovado';
  nomeDocumento: string;
}
