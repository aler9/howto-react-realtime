###############################
FROM amd64/node:12-alpine AS backend

WORKDIR /build

COPY backend/package.json backend/yarn.lock ./
RUN yarn install

COPY backend/*.js ./

###################################
FROM amd64/node:12-alpine AS scriptstyle

WORKDIR /s

COPY script/package.json script/yarn.lock ./
RUN yarn install

COPY script/webpack.config.js \
    script/.browserslistrc \
    script/babel.config.js \
    style/postcss.config.js \
    style/stylelint.config.js \
    ./

COPY script/*.jsx ./

COPY style/*.scss ./

RUN node_modules/.bin/webpack

###############################
FROM amd64/node:12-alpine

RUN adduser -D -H -s /bin/sh -u 3180 user

COPY --from=backend /build /build
COPY --from=scriptstyle /build /build
COPY ./template/index.tpl /build

USER user
WORKDIR /build

ENTRYPOINT [ "node", "main.js" ]
