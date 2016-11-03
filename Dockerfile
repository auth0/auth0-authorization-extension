FROM node:4.2-slim

ENV APP_SOURCE /usr/src/auth0-authz
COPY ./ $APP_SOURCE
WORKDIR $APP_SOURCE

RUN set -x \
  && apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && buildDeps=' \
    gcc \
    make \
    python \
  ' \
  && set -x \
  && apt-get update && apt-get install -y $buildDeps --no-install-recommends && rm -rf /var/lib/apt/lists/* \
  && npm config set registry http://registry.npmjs.org/ \\
  && npm install --no-optional \
  && npm run client:build && npm prune --production \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false -o APT::AutoRemove::SuggestsImportant=false $buildDeps \
  && npm cache clean \
  && rm -rf /var/cache/yum \
  && rm -rf /usr/lib/locale \
  && rm -rf /usr/lib/gcc \
  && rm -rf /usr/share/locale \
  && rm -rf /tmp/npm*

# Data Directory
ENV DATA_DIR $APP_SOURCE/data
RUN mkdir -p "$DATA_DIR"
VOLUME $DATA_DIR
ENV JSONDB_PATH $DATA_DIR/db.json

# Start
ENV PORT 3000
EXPOSE 3000
CMD npm run server:prod
