# Estágio 1: Build (Compilação do código React/Vite)
FROM node:18-alpine AS build
WORKDIR /app
# Copia os pacotes e instala
COPY package*.json ./
RUN npm install
# Copia o resto do código e gera a pasta 'dist'
COPY . .
RUN npm run build

# Estágio 2: Servidor Web (Nginx leve para servir os arquivos HTML/JS)
FROM nginx:alpine
# Copia os arquivos gerados no build para a pasta pública do Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Configuração obrigatória para as rotas do React (React Router) não quebrarem no Nginx
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]