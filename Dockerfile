FROM node:22

WORKDIR /app

# Install java for Firebase emulator
RUN apt-get update && apt-get install -y default-jre

# Install Firebase tools directly
RUN npm install -g firebase-tools

# Copy project files
COPY . .

# Install dependencies for functions and admin
RUN cd functions && npm install
RUN cd admin && npm install

# Build functions and admin
RUN cd functions && npm run build
RUN cd admin && npm run build

# Create a script to start the emulator
RUN echo '#!/bin/sh\nfirebase emulators:start --project=demo-project' > /app/start-emulator.sh
RUN chmod +x /app/start-emulator.sh

# Expose ports
EXPOSE 5000 5001 5002 5003 5004

# Start Firebase emulator using the script
CMD ["/app/start-emulator.sh"]