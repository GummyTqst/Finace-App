FROM node:24.16.0-alpine AS deps
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM node:24.16.0-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/app ./app
COPY --from=build /app/config ./config
COPY --from=build /app/generated ./generated
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/next-env.d.ts ./next-env.d.ts
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/package*.json ./
COPY --from=build /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=build /app/tsconfig.json ./tsconfig.json

EXPOSE 3000
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0", "-p", "3000"]



# FROM node:24.16.0-alpine AS deps
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci

# FROM deps AS build
# WORKDIR /app
# COPY . .
# RUN npm run build

# FROM node:24.16.0-alpine AS runtime
# WORKDIR /app
# ENV NODE_ENV=production

# # RUN apk add --no-cache curl

# # COPY --from=deps /app/node_modules ./node_modules
# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/.next ./.next
# COPY --from=build /app/public ./public
# COPY --from=build /app/package*.json ./
# COPY --from=build /app/next.config.ts ./next.config.ts

# EXPOSE 3000
# CMD ["npm", "run", "start", "--", "-H", "0.0.0.0", "-p", "3000"]

# # HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \ 
# #     CMD curl -f http://localhost:3000/ || exit 1