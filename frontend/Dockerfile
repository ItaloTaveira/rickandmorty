# Usa a imagem do Node.js para a build
FROM node:18 AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia os arquivos do projeto para o container
COPY . .

# Compila o projeto Vue 3
RUN npm run build

# Usa a imagem do Nginx para servir o frontend
FROM nginx:alpine

# Copia os arquivos gerados no build para a pasta pública do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o arquivo de configuração do Nginx
COPY vue-app.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 para acesso ao frontend
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
