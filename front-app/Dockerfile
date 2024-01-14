FROM node
WORKDIR /home/node
RUN mkdir app
COPY ./app /home/node/app
WORKDIR /home/node/app
RUN npm install
RUN npm install react-router-dom
CMD ["npm", "run", "dev"]
