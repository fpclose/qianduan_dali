FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install 

# Verify vite installation
RUN ls -la node_modules/.bin/ | grep vite || echo "vite not found in .bin" && \
    npm list vite && \
    node_modules/.bin/vite --version

COPY . .

ENV NODE_ENV=development
ENV PATH="/app/node_modules/.bin:$PATH"

EXPOSE 5173

CMD ["./node_modules/.bin/vite", "--host", "0.0.0.0", "--port", "5173"] 