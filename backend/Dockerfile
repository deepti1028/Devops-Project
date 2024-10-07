# Backend Dockerfile

FROM node:19 AS production

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./

RUN npm install

# Copy the backend source code
COPY . .

# Copy the frontend build output into the backend's public directory
COPY --from=frontend /app/dist /app/public/dist

# Expose the backend API port (adjust according to your app)
EXPOSE 8000

# Start the backend server
CMD ["npm", "start"]