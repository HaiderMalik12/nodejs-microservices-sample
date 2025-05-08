# Logging Service

This is a Node.js backend service built with TypeScript, designed to handle and process logs. It utilizes Express.js for the API, MongoDB for data storage, and AWS S3 for file uploads.

## Features

- **API Endpoints:** Provides RESTful API endpoints for log management.
- **Data Persistence:** Uses MongoDB to store log data.
- **File Uploads:** Supports file uploads to AWS S3.
- **Authentication & Authorization:** Implements JWT-based authentication.
- **Validation:** Uses Joi for request body validation.
- **Logging:** Integrates Pino for structured logging with `pino-pretty` for development.
- **Environment Configuration:** Uses `dotenv` for environment variable management.
- **Error Handling:** Implements robust error handling using `express-async-errors`.
- **Security:** Leverages `helmet` for enhanced security.
- **Scheduled Tasks:** Uses `node-cron` for scheduled tasks.
- **API Documentation:** Uses Swagger UI Express and YAML for API documentation.
- **Application Settings Creation:** Creates application settings based on environment variables.

## Prerequisites

- Node.js (>= 18)
- npm or yarn
- MongoDB
- AWS account with S3 access

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ZDS-RMP/logging-services
    cd logging_service
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the root directory and add the following environment variables:

    ```
    NODE_ENV=development
    MONGO_URL=mongodb://127.0.0.1:27017/zds_logs
    DB_USER=
    DB_PASSWORD=
    DB_AUTH_SOURCE=
    DB_HOST=
    USE_ATLAS=0
    DB_CLUSTER=
    DB_NAME=
    PORT=2005
    DISPATCHER_JWT_SECRET=
    ONDEMAND_JWT_SECRET=
    BASEPATH=/logging
    NEW_ACCESSKEYS3=
    NEW_SECRETACCESSKEY=
    NEW_REGION=
    NEW_BUCKET_NAME=
    DISPATCHER_BASE_URL=
    CREATE_APP_SETTINGS=1
    ```

    - **Note:** Adjust the `MONGO_URL`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `PORT`, JWT secrets, AWS S3 credentials, and other variables to match your environment.

4.  **Build the project:**

    ```bash
    npm run build
    ```

5.  **Start the server:**

    - **Development:**

      ```bash
      npm run dev
      ```

      This will start the server with `nodemon` for automatic restarts on file changes and `pino-pretty` for formatted logs.

    - **Production (using PM2):**

      ```bash
      npm run start
      ```

      This will start the server using PM2 with 5 instances for load balancing and `pino-pretty` for formatted logs.

6.  **Access API Documentation:**

    Open your browser and navigate to `http://localhost:2005/logging/api-docs` (or the port and basepath you configured).

## Scripts

- `npm run start`: Starts the production server using PM2.
- `npm run stop`: Stops all PM2 processes.
- `npm run delete`: Deletes all PM2 processes.
- `npm run dev`: Starts the development server using nodemon.
- `npm run lint:check`: Checks for ESLint errors.
- `npm run lint:fix`: Fixes ESLint errors.
- `npm run prettier:check`: Checks for Prettier formatting issues.
- `npm run prettier:fix`: Fixes Prettier formatting issues.
- `npm run build`: Builds the TypeScript project.
- `npm run test`: Runs Jest tests with coverage.

## Dependencies

- **Core:**
  - `express`: Web framework.
  - `mongoose`: MongoDB object modeling.
  - `typescript`: TypeScript language.
- **Utilities:**
  - `dotenv`: Environment variable management.
  - `cors`: Cross-origin resource sharing.
  - `helmet`: Security headers.
  - `joi`: Request body validation.
  - `jsonwebtoken`: JWT authentication.
  - `morgan`: HTTP request logging.
  - `pino-pretty`: Pretty-prints Pino logs.
  - `swagger-ui-express`: Serves Swagger UI.
  - `yamljs`: Parses YAML files.
  - `moment`: Date manipulation.
  - `moment-timezone`: Timezone handling.
  - `node-cron`: Scheduled tasks.
- **AWS:**
  - `aws-sdk`: AWS SDK for S3.
  - `multer`: Multipart form data handling.
  - `multer-s3`: Multer storage for S3.
- **Error Handling:**
  - `express-async-errors`: Handles asynchronous errors in Express.
  - `express-async-handler`: Simplified async error handling.
- **HTTP Client:**
  - `axios`: Promise based HTTP client.
- **Development:**
  - `nodemon`: Development server with auto-restart.
  - `eslint`: JavaScript linter.
  - `prettier`: Code formatter.
  - `jest`: Testing framework.
  - `@types/*`: Type definitions.
