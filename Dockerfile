FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    make \
    g++ \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copie les fichiers de dépendances ET le dossier de scripts
COPY package*.json ./
COPY scripts/ ./scripts/

# Assouplit les règles du compilateur C++ pour ffi-napi
ENV CXXFLAGS="-fpermissive"
RUN npm install

COPY . .

ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=5000

EXPOSE 5000

CMD ["node", "index.js"]
