FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./

# ---- Development ----
FROM base AS development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---- Build ----
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# ---- Production ----
FROM base AS production
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]