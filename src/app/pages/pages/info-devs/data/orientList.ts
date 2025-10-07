export type orientador = {
  nome: string;
  foto: string;
  descricao?: string;
  linkedin: string;
  email: string;
};

export const orientList: orientador[] = [
  {
    nome: 'Prof. Guilherme de Souza',
    foto: '/guilherme.jpg',
    descricao: 'Orientador de Projetos',
    linkedin: 'https://www.linkedin.com/in/guilherme-de-souza/',
    email: 'guilherme.souza@example.com',
  },
  {
    nome: 'Prof. Edson Mota',
    foto: '/edson.jpg',
    descricao: 'Orientador Técnico',
    linkedin: 'https://www.linkedin.com/in/edson-mota/',
    email: 'edson.mota@example.com'
  }

];
