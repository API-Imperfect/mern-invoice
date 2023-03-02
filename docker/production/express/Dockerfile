ARG NODE_VERSION=16-alpine3.12

FROM node:${NODE_VERSION}

LABEL mern.invoice.name="mern-invoice"
LABEL mern.invoice.license="MIT"

ENV NODE_ENV=production

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

RUN addgroup --system invoice \
  && adduser --system --ingroup invoice invoice

RUN apk --update add ttf-freefont fontconfig && rm -rf /var/cache/apk/*

RUN apk add --no-cache curl && \
   cd /tmp && curl -Ls https://github.com/dustinblackman/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz | tar xz && \
   cp -R lib lib64 / && \
   cp -R usr/lib/x86_64-linux-gnu /usr/lib && \
   cp -R usr/share /usr/share && \
   cp -R etc/fonts /etc && \
   curl -k -Ls https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar -jxf - &&\
   cp phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs && \
   rm -fR phantomjs-2.1.1-linux-x86_64 && \
   apk del curl

COPY package*.json ./

RUN npm install

COPY --chown=invoice:invoice . ${APP_HOME}

RUN chown invoice:invoice ${APP_HOME}

USER invoice

CMD [ "npm","run","start" ]