FROM node:22.15.0-alpine3.21

ENV HOME=/home/app
ENV APP_PATH=$HOME/api-documentation

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/

# Run npm install before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN yarn

# Copy necessary source files for server and client build
COPY .babelrc $APP_PATH/
COPY src $APP_PATH/src

# Build client code
WORKDIR $APP_PATH

CMD ["npm", "run", "start-prod"]
