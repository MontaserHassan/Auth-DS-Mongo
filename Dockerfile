FROM node:slim

WORKDIR /app

COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code to the working directory
COPY . .

# Build TypeScript source code (assuming you have a build script defined in your package.json)
RUN npm run build

EXPOSE 3000

CMD ["node", "build/index.js"]