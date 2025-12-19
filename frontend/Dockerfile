# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Argumento para URL da API
ARG REACT_APP_API_URL=http://localhost:5000/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copiar arquivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar codigo fonte
COPY . .

# Build da aplicacao
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar configuracao do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build do React
COPY --from=build /app/build /usr/share/nginx/html

# Expor porta
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
