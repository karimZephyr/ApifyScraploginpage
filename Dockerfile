FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

# Installer les dépendances de Playwright (browsers + librairies)
RUN npx playwright install --with-deps

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
