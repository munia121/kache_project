# E-Commerce Backend (TypeScript + Express + PostgreSQL + Prisma ORM)

A clean and organized backend setup for an e-commerce platform using Node.js, TypeScript, Express.js, PostgreSQL, and Prisma ORM.

## Tech Stack

* **Node.js**: JavaScript runtime environment
* **TypeScript**: Static typing for maintainable and scalable code
* **Express.js**: Fast, minimalist web framework
* **Prisma ORM (`@prisma/client`)**: Type-safe database client and migrations
* **PostgreSQL (`pg` & `@prisma/adapter-pg`)**: Relational database connection pool
* **npm / pnpm**: Package manager

---

## Project Structure

```text
├── prisma/
│   ├── schema/           # Modular Prisma schemas
│   │   ├── schema.prisma # Base datasource & generator configuration
│   │   ├── category.prisma # Category model schema
│   │   ├── user.prisma   # User model & Role enum schema
│   │   ├── product.prisma # Product & ProductImage models schema
│   │   └── order.prisma  # Order & OrderItem models, enums schema
│   └── migrations/       # Database migration history
├── src/
│   ├── app.ts            # Express application creation, middleware (CORS, cookie-parser, JSON), & routes
│   ├── server.ts         # Server entry point & port listening
│   ├── config/
│   │   └── index.ts      # Application environment configuration
│   └── modules/          # Modular feature-based application modules
│       ├── category/     # Category module interfaces & types
│       ├── user/         # User module interfaces & types
│       ├── product/      # Product module interfaces & types
│       └── order/        # Order module interfaces & types
├── .env                  # Local environment variables (ignored by git)
├── .env.example          # Environment variable template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and npm scripts
├── prisma.config.ts      # Prisma 7 configuration file (schema: "prisma/schema")
├── tsconfig.json         # TypeScript compiler configuration
└── README.md             # Project documentation
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update your database credentials in `.env`:

```env
PORT=5000
NODE_ENV=development

# Database connection URL
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ecommerce_db

# PostgreSQL individual variables
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=ecommerce_db
```

### 3. Run Prisma Migrations

To apply schema changes to PostgreSQL:

```bash
npm run prisma:migrate
```

To regenerate Prisma client types:

```bash
npm run prisma:generate
```

To browse and manage your database via Prisma Studio GUI:

```bash
npm run prisma:studio
```

---

## Available Scripts

* `npm run dev` - Starts the development server with automatic file watching and restart (via `tsx watch`).
* `npm run build` - Compiles TypeScript files into JavaScript in the `dist/` directory (via `tsc`).
* `npm start` - Runs the compiled production server (`node dist/server.js`).
* `npm run prisma:generate` - Generates Prisma client types.
* `npm run prisma:migrate` - Applies migrations to the database.
* `npm run prisma:studio` - Launches Prisma Studio in the browser.

---

## Testing the Server

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test the API endpoints:
   * **Root Health Route**:
     ```bash
     curl http://localhost:5000/
     ```
     Response:
     ```json
     {
       "status": "success",
       "message": "E-commerce API server is running",
       "timestamp": "..."
     }
     ```
   * **Health Route**:
     ```bash
     curl http://localhost:5000/health
     ```
     Response:
     ```json
     {
       "status": "ok"
     }
     ```
