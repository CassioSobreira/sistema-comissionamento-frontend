export interface Pendencia {
  idDocumento: number;
  numeroProtocolo: string | null;
  nomeCriador: string;
  nomeAprovador: string;
  modulo: string;
  status: 'pendente' | 'concluido' | 'rejeitado';
  nomeDocumento: string;
  dataInicio: string;
  dataFim: string | null;
  aprovadoresConcluidos: number;
  totalAprovadores: number;
  usuarioAprovou: boolean;
  usuarioRejeitou: string | null;
}
