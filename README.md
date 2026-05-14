# Simple-Drink-Shop-Manager

A robust and scalable backend system designed to manage the core operations of a drink shop, including customer accounts, product categories, customer information, and order processing. Built with modern TypeScript, Node.js, and a focus on performance and maintainability.

## ✨ Key Features

*   **Account Management:** Secure handling of user accounts for staff and administrators.
*   **Customer Management:** Comprehensive system to manage customer details and purchase history.
*   **Category Management:** Organize drinks into various categories for easy navigation and inventory.
*   **Order Processing:** Streamlined creation, tracking, and management of customer orders.
*   **Type-Safe Database Interactions:** Leverages Drizzle ORM for a robust and error-resistant data layer.
*   **High Performance:** Built with Nitro, a powerful server engine for optimal performance and developer experience.
*   **Scalable Database:** Integrates with PostgreSQL (via Neon serverless) for a highly available and scalable data store.
*   **Clear Error Handling:** Utilizes a custom PostgreSQL error code mapping for precise error responses.

## 🛠️ Technologies Used

### Languages

*   [TypeScript](https://www.typescriptlang.org/)

### Tools & Frameworks

*   [Node.js](https://nodejs.org/)
*   [Nitro](https://nitro.unjs.io/)
*   [Drizzle ORM](https://orm.drizzle.team/)
*   [Neon Database (Serverless PostgreSQL)](https://neon.tech/)
*   [H3](https://github.com/unjs/h3) (HTTP framework used by Nitro)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: [LTS version recommended](https://nodejs.org/en/download/)
*   **npm** (or Yarn/pnpm): Comes with Node.js
*   **PostgreSQL Database**: Access to a PostgreSQL instance (e.g., [Neon.tech](https://neon.tech/), Supabase, or a local Docker container).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Nekitori17/Simple-Drink-Shop-Manager.git
    cd Simple-Drink-Shop-Manager
    ```

2.  **Navigate to the backend application:**

    The backend code resides in the `apps/BackEnd` directory.

    ```bash
    cd apps/BackEnd
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    # or yarn install
    # or pnpm install
    ```

### Configuration

1.  **Environment Variables:**
    Create a `.env` file in the `apps/BackEnd` directory by copying the `.env.example` file:

    ```bash
    cp .env.example .env
    ```

    Open `.env` and configure your database connection string:

    ```ini
    # .env
    DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
    ```
    Replace the placeholder with your actual PostgreSQL connection URL. If you're using Neon, it provides a direct connection string.

2.  **Database Schema & Migrations:**

    This project uses Drizzle ORM. Ensure your database schema is up-to-date with the definitions in `server/db/schema`.

    *   **Push schema to your database (for initial setup or development):**
        ```bash
        npx drizzle-kit push:pg
        ```
    *   **Generate new migrations (if you modify the schema):**
        ```bash
        npx drizzle-kit generate:pg
        ```
    *   **Apply migrations:**
        (This project doesn't include explicit migration application scripts in `package.json`, typically `drizzle-kit push` is sufficient for development or you'd use a custom script for production migrations.)

### Running the Project

1.  **Development Server:**

    To start the backend in development mode with hot-reloading:

    ```bash
    npm run dev
    ```
    The server will typically run on `http://localhost:3000` (or another port if configured by Nitro).

2.  **Building for Production:**

    To compile the backend for a production environment:

    ```bash
    npm run build
    ```
    This will create an optimized output in the `.output` directory.

3.  **Preview Production Build:**

    To test the production build locally:

    ```bash
    npm run preview
    ```
    This will start the server using the compiled output.

## 💡 Usage Examples & API Endpoints

The backend exposes a set of RESTful APIs to interact with the drink shop manager system. While specific routes are not fully detailed here, based on the database schema, you can expect endpoints for managing:

*   **Accounts:** `POST /api/accounts` (create), `GET /api/accounts/:id` (retrieve), `PUT /api/accounts/:id` (update), `DELETE /api/accounts/:id` (delete).
*   **Categories:** `POST /api/categories`, `GET /api/categories`, etc.
*   **Customers:** `POST /api/customers`, `GET /api/customers`, etc.
*   **Orders:** `POST /api/orders`, `GET /api/orders`, etc.

**Example (Conceptual - actual routes may vary):**

To create a new customer:

```http
POST /api/customers
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "123-456-7890"
}
```

To retrieve all orders:

```http
GET /api/orders
```

Detailed API documentation (e.g., OpenAPI/Swagger) would typically be generated or provided separately once the routes are fully implemented.

## ⚙️ Configuration Options

This project primarily uses environment variables for runtime configuration and dedicated configuration files for build-time settings.

*   **`.env` File**:
    *   `DATABASE_URL`: Essential for connecting to the PostgreSQL database.

*   **`drizzle.config.ts`**:
    *   Defines Drizzle ORM's behavior, including schema location (`./server/db/schema.ts`), output directory for migrations (`./drizzle`), and database dialect (`postgresql`).

*   **`nitro.config.ts`**:
    *   Configures the Nitro server, specifying the source directory (`server`), import aliases (`@db`, `@utils`, `~`), and other build-time optimizations.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please follow these steps:

1.  **Fork** the repository.
2.  **Create a new branch** (`git checkout -b feature/your-feature-name` or `bugfix/your-bug-fix`).
3.  **Make your changes**, ensuring they adhere to the project's coding style (ESLint/Prettier might be integrated, or follow existing patterns).
4.  **Commit your changes** with a clear and descriptive message.
5.  **Push** your branch to your forked repository.
6.  **Open a Pull Request** to the `main` branch of this repository.

Please provide a detailed description of your changes in the pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

*   [Node.js](https://nodejs.org/) - The JavaScript runtime.
*   [TypeScript](https://www.typescriptlang.org/) - For type-safe JavaScript.
*   [Nitro](https://nitro.unjs.io/) - The powerful server engine.
*   [Drizzle ORM](https://orm.drizzle.team/) - For elegant and type-safe database interactions.
*   [Neon Database](https://neon.tech/) - For serverless PostgreSQL.
*   [H3](https://github.com/unjs/h3) - Minimal and performant HTTP framework.