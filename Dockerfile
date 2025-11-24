# Dockerfile para modo de desenvolvimento
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Expor porta 5050 (porta do Angular dev server)
EXPOSE 5050

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
