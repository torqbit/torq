FROM node:18-alpine

WORKDIR /app

# Install Yarn package manager
RUN npm install yarn

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --production

# Copy the rest of the application code
COPY . .

# Generate the schema & build the Next.js application
RUN npx prisma generate && yarn build 

# Expose the port Next.js is running on
EXPOSE 3000

# Start the Next.js application

CMD ["sh","-c", "npx prisma db push --accept-data-loss && cat ascii && yarn start"]