# Usa a imagem do Node.js
FROM node:18

# Define o diretório de trabalho correto
WORKDIR /usr/server

# Copia apenas os arquivos necessários primeiro (para cache eficiente)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código do backend para dentro do container
COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Altere o caminho para rodar o servidor corretamente
CMD ["node", "src/server.js"]
