# Base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Clone the Stockfish repository and build the engine
RUN mkdir -p ./engine && cd ./engine \
    && rm -f ./stockfish \
    && git clone https://github.com/official-stockfish/Stockfish.git \
    && cd Stockfish/src/ \
    && make -j build ARCH=x86-64 \
    && mv ./stockfish ./../.. \
    && chmod +x /usr/src/app/engine/stockfish


# Copy all files to the container
COPY . .

# Build the TypeScript project
RUN tsc -b

# Expose the application port
EXPOSE 8000

# Command to start the application
CMD ["npm", "start"]
