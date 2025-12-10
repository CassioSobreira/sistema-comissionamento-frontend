const hostname = window.location.hostname;

// se tiver "vercel.app" na URL → estamos no Vercel
const isVercel = hostname.includes('vercel.app');

export const environment = {
  production: false, // isso aqui não faz diferença pra API agora
  apiUrl: isVercel
    ? 'https://projeto-comissionamento-backend-pg.vercel.app/api' // API do Vercel
    : 'http://localhost:3000/api' // API local (VM / máquina)
};

console.log('Hostname:', hostname);
console.log('API URL em uso:', environment.apiUrl);
