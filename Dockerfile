FROM node:20-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --production || true

COPY . .

EXPOSE 3000
CMD ["node", "scripts/daily-leads.mjs"]
