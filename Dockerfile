FROM node:4.2-slim

ENV APP_SOURCE /usr/src/iam-dashboard
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
		unzip \
	' \
	&& set -x \
	&& apt-get update && apt-get install -y $buildDeps --no-install-recommends && rm -rf /var/lib/apt/lists/* \
  && npm config set registry http://registry.npmjs.org/ \\
	&& npm install --no-optional \
	&& npm run build:prod && npm prune --production \
	&& apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false -o APT::AutoRemove::SuggestsImportant=false $buildDeps \
	&& npm cache clean \
	&& rm -rf /tmp/npm*

# Data Directory
ENV DATA_DIR $APP_SOURCE/data
RUN mkdir -p "$DATA_DIR"
VOLUME $DATA_DIR
ENV JSONDB_PATH $DATA_DIR/db.json

# Start
ENV PORT 3000
EXPOSE 3000
CMD npm run serve:prod
