from node:8

WORKDIR /src
COPY . /src/

RUN npm i

CMD node index.js

