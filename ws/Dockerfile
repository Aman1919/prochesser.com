FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
# Install TypeScript globally
RUN npm install -g typescript

COPY . .

RUN chmod +x /usr/src/app/engine/stockfish

# RUN npm run build
RUN tsc -b

EXPOSE 8000
CMD ["npm", "start"]