# Setup
## initialize a new Node.js project:
`npm init -y`

## Setup up environment and Install Dependencies:

`npm install typescript ts-node @types/node openai amqplib uuid dotenv zod pdf-parse`
`npm install @types/amqplib --save-dev`
`npm install --save-dev @types/node`
`npm i --save-dev @types/pdf-parse`
`docker pull rabbitmq:3-management`
``

## create config file
`npx tsc --init`

## Test
Ensure dockor image is setup for Rabbitmq
To run jest tests - simply run 'npm test' as the script is setup


# Running the program
ensure Docker is running `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`
CLI: `npx ts-node index.ts`
