# Viva MQ

## Table of Contents
- [Viva MQ](#viva-mq)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
    - [Using Docker Compose](#using-docker-compose)
    - [Local Development](#local-development)
  - [Database Management](#database-management)
    - [Using Prisma](#using-prisma)
  - [Development Practices](#development-practices)
  - [Git Commit Structure](#git-commit-structure)
  - [Contributing](#contributing)
    - [Forking the Repository](#forking-the-repository)
    - [Making a Pull Request](#making-a-pull-request)

---

## Prerequisites

Before you begin, ensure you have the following prerequisites installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for local development)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

Follow these steps to set up your local development environment:

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name
    ```

2. **Install backend dependencies:**
    ```sh
    cd backend
    npm install
    ```

3. **Install frontend dependencies:**
    ```sh
    cd ../frontend
    npm install
    ```

## Running the Application

### Using Docker Compose

To start the application using Docker Compose:

1. **Build and run the Docker containers:**
    ```sh
    docker-compose up --build -d
    ```

    The `-d` flag runs the containers in detached mode.

2. **Access the services:**
    - Backend: [http://localhost:8080](http://localhost:8080)
    - Frontend: [http://localhost:3000](http://localhost:3000)

3. **Stop the Docker containers:**
    ```sh
    docker-compose down
    ```

### Local Development

To start the application for local development:

1. **Start the backend:**
    ```sh
    cd backend
    npm run dev
    ```

2. **Start the frontend:**
    ```sh
    cd frontend
    npm run dev
    ```

    Access the services as above.

## Database Management

### Using Prisma

1. **Run database migrations:**
    ```sh
    cd backend
    npm run prisma:migrate
    ```

2. **Open Prisma Studio:**
    ```sh
    cd backend
    npm run prisma:studio
    ```

    Prisma Studio can be accessed at [http://localhost:5555](http://localhost:5555). // I don't remember the port

## Development Practices

- **Code Linting:**
    ```sh
    cd backend
    npm run lint

    cd ../frontend
    npm run lint
    ```

- **Code Formatting:**
    ```sh
    cd backend
    npm run format

    cd ../frontend
    npm run format
    ```

- **Running Tests:**
    ```sh
    cd backend
    npm test
    ```

## Git Commit Structure

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Example Commit Message:
```feat(auth): add user authentication```


## Contributing

We welcome contributions! Follow these steps to contribute:

### Forking the Repository

1. **Fork the repository:**
    Go to the GitHub page for this repository and click the "Fork" button in the top right.

2. **Clone your forked repository:**
    ```sh
    git clone https://github.com/yourusername/reponame.git
    cd vivamq
    ```

### Making a Pull Request

1. **Create a new branch:**
    ```sh
    git checkout -b feature/your-feature-name
    ```

2. **Make your changes and commit them:**
    ```sh
    git commit -m "feat: add your feature"
    ```

3. **Push to your forked repository:**
    ```sh
    git push origin feature/your-feature-name
    ```

4. **Open a pull request:**
    Go to the GitHub page for this repository and click the "New pull request" button.
