# Order Service

This is a Node.js backend service built with TypeScript, designed to handle and process logs. It utilizes Express.js for the API, MongoDB for data storage

## Prerequisites

- Node.js (>= 18)
- npm or yarn
- MongoDB

## Getting Started

1.  **Clone the repository:**

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the root directory and add the following environment variables:

    ```
    NODE_ENV=development
    MONGO_URL=mongodb://127.0.0.1:27017/faba_orders
    ```

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
