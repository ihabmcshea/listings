# pull base image
FROM node:20

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

WORKDIR /opt/my-app

COPY ./package.json .
COPY ./yarn.lock .
RUN yarn 
# We need this so we can tunnel expo 
RUN yarn add @expo/ngrok@^4.1.0


CMD ["npx","expo", "start", "--tunnel"]
