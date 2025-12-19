# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar codigo fonte
COPY . .

# Criar diretorio de uploads
RUN mkdir -p uploads/documents uploads/videos

# Expor porta
EXPOSE 5000

# Comando para iniciar
CMD ["node", "src/server.js"]
