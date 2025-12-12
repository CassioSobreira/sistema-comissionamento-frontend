const hostname = window.location.hostname;

// se tiver "vercel.app" na URL → estamos no Vercel
const isLoacal = hostname.includes('localhost');
const isVercel = hostname.includes('vercel.app');
export const environment = {
  production: false, // isso aqui não faz diferença pra API agora
  apiUrl: isLoacal
    ? 'http://localhost:3000/api' // API LOCAL
    : isVercel
      ? 'https://projeto-comissionamento-backend-pg.vercel.app/api' // API VERCEL (Frontend)
      : 'http://172.25.0.189:3000'// API VERCEL (VM / máquina)
};

console.log('Hostname:', hostname);
console.log('API URL em uso:', environment.apiUrl);
