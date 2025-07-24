+ FROM apify/actor-node-playwright:16

COPY . ./

RUN npm install --quiet --only=prod --no-optional && (npm list || true)

LABEL com.apify.actBuildId=dev
