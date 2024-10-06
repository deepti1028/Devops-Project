FROM node:19

WORKDIR /app/frontend

COPY ./frontend/package*.json /app/frontend

RUN npm install 

COPY ./frontend/* /app/frontend

RUN npm run build

WORKDIR /app/backend

COPY ./backend/package*.json /app/backend

RUN npm install

COPY ./backend/* /app/backend

CMD npm start
