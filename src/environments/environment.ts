const hostname = window.location.hostname;

// se tiver "vercel.app" na URL → estamos no Vercel
const isLoacal = hostname.includes('localhost');

export const environment = {
  production: false, // isso aqui não faz diferença pra API agora
  apiUrl: isLoacal
    ? 'http://localhost:3000/api' // API LOCAL
    : 'https://projeto-comissionamento-backend-pg.vercel.app/api'// API VERCEL (VM / máquina)
};

console.log('Hostname:', hostname);
console.log('API URL em uso:', environment.apiUrl);
