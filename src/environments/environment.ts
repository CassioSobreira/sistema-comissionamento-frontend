const getBackendUrl = () => {
  // Pega o domínio/IP atual do navegador (ex: 'localhost', '172.25.0.189', 'meu-site.vercel.app')
  const host = window.location.hostname;

  // --- CENÁRIO 1: Desenvolvimento Local ---
  if (host === 'localhost' || host === '127.0.0.1') {
    console.log('Ambiente detectado: LOCAL');
    return 'http://localhost:3000/api';
  }

  // --- CENÁRIO 2: Máquina Virtual (VM) ---
  // Se o front estiver rodando no IP da VM, ele usa o back da VM
  if (host === '172.25.0.189') { // <--- Seu IP da VM ainda vai ser alterado ate a VM entrar no Ar
    console.log('Ambiente detectado: VM');
    return 'http://172.25.0.189:3000/api';
  }

  // --- CENÁRIO 3: Produção (Vercel ou qualquer outro) ---
  console.log('Ambiente detectado: PRODUÇÃO');
  return 'https://projeto-comissionamento-backend.vercel.app/api'; 
};

export const environment = {
  production: false,
  // A apiUrl agora é dinâmica baseada na função acima
  apiUrl: getBackendUrl()
};

