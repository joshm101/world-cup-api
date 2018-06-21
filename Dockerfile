FROM mhart/alpine-node:8

# Create app directory
WORKDIR ./app

# Install dependencies
# A wildcard is used to ensure both package.json AND package-lock.json
# are copied where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ARG WCA_MONGODB_CONNECTION_URI
ARG WCA_MONGODB_CONNECTION_USERNAME
ARG WCA_MONGODB_CONNECTION_PASSWORD

ENV WCA_MONGODB_CONNECTION_URI=$WCA_MONGODB_CONNECTION_URI
ENV WCA_MONGODB_CONNECTION_USERNAME=$WCA_MONGODB_CONNECTION_USERNAME
ENV WCA_MONGODB_CONNECTION_PASSWORD=$WCA_MONGODB_CONNECTION_PASSWORD

CMD ["npm", "start"]