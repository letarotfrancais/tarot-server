# syntax=docker/dockerfile:experimental

# BUILD STAGE
FROM alpine as build
LABEL stage=build

# Install ans setup build dependencies
RUN apk add --no-cache openssh-client git nodejs yarn
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# Install project dependencies
WORKDIR /root/tmp
COPY package.json ./
COPY yarn.lock ./
RUN --mount=type=ssh yarn

# TODO: build tarot-core to its own npm registry
RUN cd node_modules/tarot-core \
    && yarn global add typescript \
    && yarn \
    && yarn build

# RUN STAGE
FROM alpine

RUN apk add --no-cache nodejs yarn

# Get project dependencies and project source code
WORKDIR /root/
COPY --from=build /root/tmp .
COPY . .

ENV NODE_ENV prod
ENV APP_PORT=80 APP_HOST=0.0.0.0
ENV JWT_EXPIRE=1w
ENV DB_USERNAME=postgres
CMD ["yarn", "start"]