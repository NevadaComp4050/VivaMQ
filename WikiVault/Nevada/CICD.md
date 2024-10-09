# CI/CD Pipeline for vivamq Project

This documentation provides a complete guide for setting up a CI/CD pipeline for the **vivamq** project. The pipeline covers continuous integration (CI) processes such as regression testing, integration testing, and deployment to both a staging environment and production. We also cover testing documentation, integration documentation, and AI research-related aspects of the project.

## Table of Contents

- [CI/CD Pipeline for vivamq Project](#cicd-pipeline-for-vivamq-project)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [CI/CD Pipeline Goals](#cicd-pipeline-goals)
  - [CI/CD Pipeline Configuration](#cicd-pipeline-configuration)
    - [Prerequisites](#prerequisites)
    - [GitHub Actions Workflow](#github-actions-workflow)
  - [Testing Strategy](#testing-strategy)
    - [Jest Unit Testing](#jest-unit-testing)
    - [Regression Testing](#regression-testing)
    - [Integration Testing](#integration-testing)
    - [Staging Environment](#staging-environment)
  - [Documentation](#documentation)
    - [API Integration Documentation via Swagger](#api-integration-documentation-via-swagger)
    - [Frontend Client Design Specification](#frontend-client-design-specification)
    - [AI Research and RabbitMQ API Integration](#ai-research-and-rabbitmq-api-integration)
  - [Conclusion](#conclusion)

---

## Overview

The **vivamq** project is a microservices-based application comprising multiple services:
- **Backend**: Handles business logic.
- **Frontend**: User-facing client.
- **AI Processor**: Responsible for AI-based processing, integrated via RabbitMQ.
- **MySQL, RabbitMQ, Redis**: Support services for database, messaging, and caching, respectively.

### CI/CD Pipeline Goals

The CI/CD pipeline automates:
- Building and pushing Docker images to Docker Hub.
- Running Jest unit tests.
- Performing regression and integration tests.
- Deploying to staging and production environments.
- Ensuring integration documentation via Swagger and client design specs.
- Managing AI processor API integration with RabbitMQ.

---

## CI/CD Pipeline Configuration

The pipeline is defined using GitHub Actions and Docker. The configuration file is located at `.github/workflows/deploy.yml` in the repository.

### Prerequisites

1. **Docker Hub Account**: Store Docker images.
2. **GitHub Secrets**: Add the following secrets to your repository:
   - `DOCKER_HUB_USERNAME`: Your Docker Hub username.
   - `DOCKER_HUB_ACCESS_TOKEN`: Docker Hub access token or password.
   - `DROPLET_IP`: DigitalOcean droplet IP address.
   - `DROPLET_USER`: SSH username (e.g., `debbot`).
   - `SSH_PRIVATE_KEY`: SSH key for accessing the DigitalOcean droplet.

### GitHub Actions Workflow

Here’s the GitHub Actions configuration used to build, test, and deploy the Docker images for the **vivamq** project:

```yaml
name: Build, Test, and Deploy vivamq

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # Checkout the code
      - name: Checkout code
        uses: actions/checkout@v4

      # Set up QEMU for multi-platform builds
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      # Set up Docker Buildx for building Docker images
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      # Login to Docker Hub
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

      # Build and push Backend image
      - name: Build and push vivamq-backend
        uses: docker/build-push-action@v6
        with:
          context: ./backend
          push: true
          tags: megapz/vivamq-backend:latest

      # Build and push AI Processor image
      - name: Build and push vivamq-ai-processor
        uses: docker/build-push-action@v6
        with:
          context: ./ai-processor
          push: true
          tags: megapz/vivamq-ai-processor:latest

      # Build and push Frontend image
      - name: Build and push vivamq-frontend
        uses: docker/build-push-action@v6
        with:
          context: ./frontend
          push: true
          tags: megapz/vivamq-frontend:latest

  # Testing stage
  test:
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      # Install dependencies and run Jest tests
      - name: Install dependencies
        run: npm install

      - name: Run Jest unit tests
        run: npm test

      # Add regression and integration tests as needed

  # Deployment stage (to staging)
  deploy:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      # Install SSH client
      - name: Install SSH client
        run: sudo apt-get update && sudo apt-get install -y ssh

      # Deploy to DigitalOcean droplet (staging environment)
      - name: Deploy to Staging
        env:
          DROPLET_IP: ${{ secrets.DROPLET_IP }}
          DROPLET_USER: ${{ secrets.DROPLET_USER }}
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          echo "$SSH_PRIVATE_KEY" > private_key
          chmod 600 private_key
          ssh -o StrictHostKeyChecking=no -i private_key $DROPLET_USER@$DROPLET_IP << 'EOF'
            cd /path/to/your/vivamq/docker-compose
            docker-compose pull
            docker-compose up -d
          EOF
```

---

## Testing Strategy

### Jest Unit Testing

For unit testing, we use **Jest**, which is configured to run tests for all services:

1. **Backend**: API and business logic.
2. **AI Processor**: Ensure that AI processing is functioning correctly.
3. **Frontend**: Unit tests for UI components.

Add a `test` script to each service’s `package.json`:

```json
"scripts": {
  "test": "jest"
}
```

### Regression Testing

Regression testing is performed to ensure that new code does not break existing functionality. These tests cover all critical paths and components across the **vivamq** system, including:
- API requests and responses.
- Data processing via the AI processor.
- End-to-end flows between the frontend and backend.

Add regression tests to each service's `tests/` folder and run them during the CI pipeline.

### Integration Testing

Integration tests verify that different parts of the system interact correctly. This includes:
- **Backend and MySQL**: Verify database operations.
- **Backend and RabbitMQ**: Test message queueing.
- **Frontend and Backend**: Ensure API requests are correctly handled.

### Staging Environment

The **staging environment** simulates production. It should be configured similarly to production but should only be accessible to internal users for testing new features and bug fixes.

Steps to set up the staging environment:
1. Set up a separate droplet on DigitalOcean for staging.
2. Deploy all services to staging before production.
3. Run integration and regression tests in the staging environment.

---

## Documentation

### API Integration Documentation via Swagger

We use **Swagger** to document all API endpoints provided by the backend and AI processor services. Swagger provides a comprehensive overview of the available endpoints, input parameters, and expected responses.

To set up Swagger:
1. Install `swagger-jsdoc` and `swagger-ui-express` in the backend service.
2. Define API documentation in a YAML file, following the OpenAPI 3.0 specification.
3. Serve the documentation at `/api-docs`.

### Frontend Client Design Specification

The frontend design follows a specific design spec to ensure consistency and usability across the application. The design spec includes:
- **UI/UX Wireframes**: Provide the visual layout of pages.
- **Component Documentation**: List of reusable components and their behavior.
- **Client-API Integration**: Document how the frontend interacts with backend APIs, including the structure of requests and responses.

All design documentation should be stored in a dedicated `docs/design` folder within the repository.

### AI Research and RabbitMQ API Integration

The **AI Processor** interacts with the system via RabbitMQ for processing tasks asynchronously. This integration is critical for handling large-scale data processing.

- **RabbitMQ Configuration**: Queue settings for managing AI processing tasks.
- **AI Research Documentation**: Document the AI models used, input/output expectations, and how they interact with the overall system.
- **Error Handling and Retries**: Define how the AI processor handles failed tasks and how RabbitMQ retries them.

---

## Conclusion

This document serves as a comprehensive guide for setting up and maintaining the CI/CD pipeline for the **vivamq** project. It covers the configuration of GitHub Actions, testing strategies, and the necessary documentation for API integration, frontend design, and AI processor integration.

By following this guide, the **vivamq** project will have a robust CI/CD pipeline with automated testing and deployment, ensuring high-quality software delivery.