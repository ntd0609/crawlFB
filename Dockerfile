# Use the official Node.js v8 image
FROM node:18

RUN apt-get update && apt-get install -y nano \
    && rm -rf /var/lib/apt/lists/*


# Set working directory
WORKDIR /usr/src/app

COPY . .
# RUN npm i
# RUN npm run start

EXPOSE 3000

ENTRYPOINT ["tail", "-f", "/dev/null"]
