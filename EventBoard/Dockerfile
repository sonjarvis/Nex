FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 3005
CMD ["npm", "run", "dev"]
