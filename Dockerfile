# Utiliser une image officielle Node.js 20 LTS
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code source
COPY . .

# Exposer un port si nécessaire (par exemple 3000)
EXPOSE 3000

# Commande par défaut pour lancer l'application
CMD ["node", "index.js"]
