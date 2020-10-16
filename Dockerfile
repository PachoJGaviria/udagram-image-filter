FROM node:12-alpine
LABEL Autor="PachoJGaviria (https://github.com/PachoJGaviria)"
ENV NODE_ENV production
RUN mkdir -p /usr/filter/app && chown -R node:node /usr/filter
USER node
WORKDIR /usr/filter/app
COPY --chown=node:node ["package.json", "package-lock.json", "./"]
RUN npm ci --production && mv node_modules ../ && npm cache clean --force
COPY --chown=node:node ./www ./src
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["node", "src/server.js"]