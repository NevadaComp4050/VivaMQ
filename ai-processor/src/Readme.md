# Setup
## initialize a new Node.js project:
`npm init -y`

## Setup up environment and Install Dependencies:

`npm install typescript ts-node @types/node openai amqplib uuid dotenv zod pdf-parse`
1) Install packages for typescript.
2) Allow TypeScript files to run directly without the need for a separate build step.
3) Provide TypeScript type definitions for Node.js
4) Install the client library for access to OpenAI's API.
5) Install the client library for interacting with RabbitMQ using AMQP.
6) Generate unique identifiers (UUID)s
7) Load environment variables from a `.env` file into `process.env` to manage sensitive information like API keys.
8) A schema declaration and validation library for TypeScript. Used to eliminate duplicative type declarations.
9) A library to extract text from PDFs.

`npm install @types/amqplib --save-dev`
Install TypeScript type definitions for the amqplib package. Helpful with type checking when using RabbitMQ in a TypeScript ennvironment.

`npm install --save-dev @types/node`
Installs TypeScript type definitions for Node.js as a development dependency and ensures type safety.

`npm i --save-dev @types/pdf-parse`
Installs TypeScript type definitions for the pdf-parse package. A development dependency that ensures TypeScript can understand and work with pdf-parse.

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
