export interface Pendencia {
  idDocumento: number;
  numeroProtocolo: string | null;
  nome: string;
  modulo: string;
  status: 'pendente' | 'concluido';
  nomeDocumento: string;
  dataInicio: string;
  dataFim: string | null;
  aprovadoresConcluidos: number;
  totalAprovadores: number;
  usuarioAprovou: boolean;
}
