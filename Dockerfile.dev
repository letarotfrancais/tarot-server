FROM alpine

RUN apk update \
    && apk add --no-cache git openssh-client nodejs yarn

RUN mkdir /root/.ssh \
    && ssh-keyscan github.com >> /root/.ssh/known_hosts

# TAROT CORE BUILD GLOBAL DEPENDENCIIES
RUN yarn global add typescript