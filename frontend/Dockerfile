# Stage 1: Build React application
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
