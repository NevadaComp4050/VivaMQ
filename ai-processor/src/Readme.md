# Setup
## initialize a new Node.js project:
`npm init -y`

## Setup up environment and Install Dependencies:
Install Node -> Run `npm install ` while in /src this will install all dependencies contained in package.json.

## RabbitMq
`docker pull rabbitmq:3-management`
Pulls the Docker image for RabbitMQ with the management plugin enabled. It includes a web-based interface for managing RabbitMQ. This is needed for running RabbitMQ in a Docker container locally.

## create config file

Create a `tsconfig.json` file to initialize the TypeScript project.
`npx tsc --init`

## Test
Ensure dockor image is setup for Rabbitmq
To run jest tests - simply run 'npm test' as the script is setup

# Running the program
Ensure Docker is running and start RabbitMQ with the management plugin:
`docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`

Setup a `.env` environment file to store the API Key. Replace `OPENAI_API_KEY` with an actual API Key:
`OPENAI_API_KEY =  "Your OpenAI API Key"`

Execute the command to run the application in TypeScript code in `index.ts` using Node.js.
CLI: `npx ts-node index.ts`
