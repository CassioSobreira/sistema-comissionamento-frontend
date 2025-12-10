# ETAPA 1 — Build Angular
FROM node:22-alpine AS build

WORKDIR /app

# Copia configs e instala dependências
COPY package*.json ./
RUN npm install

# Copia todo o código do Angular
COPY . .

# Gera o build de produção
RUN npm run build

# ETAPA 2 — Servir com Nginx
FROM nginx:alpine

# Copia configuração customizada do Nginx para não haver falha ao buscar rotas
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Pasta padrão do nginx
# Ajuste do caminho final do build do Angular 20+
COPY --from=build /app/dist/sistema-comissionamento-frontend/browser /usr/share/nginx/html

# Expor porta do servidor web
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
