# E-Commerce Backend (TypeScript + Express + PostgreSQL)

A clean and organized backend setup for an e-commerce platform using Node.js, TypeScript, Express.js, and PostgreSQL.

## Tech Stack

* **Node.js**: JavaScript runtime environment
* **TypeScript**: Static typing for maintainable and scalable code
* **Express.js**: Fast, minimalist web framework
* **PostgreSQL (`pg`)**: Relational database connection pool
* **npm**: Package manager

---

## Project Structure

```text
├── src/
│   ├── app.ts            # Express application creation, middleware, & routes
│   ├── server.ts         # Server startup, port listening, & DB connectivity check
│   ├── config/
│   │   └── db.ts         # PostgreSQL connection pool configuration
│   └── db/
│       └── schema.sql    # SQL database schema reference
├── .env                  # Local environment variables (ignored by git)
├── .env.example          # Environment variable template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and npm scripts
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

Copy `.env.example` to `.env` (if not already created) and update your database credentials:

```bash
cp .env.example .env
```

Default `.env` configuration:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=ecommerce_db

# Or full connection string:
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ecommerce_db
```

---

## Available Scripts

* `npm run dev` - Starts the development server with automatic file watching and restart (via `tsx watch`).
* `npm run build` - Compiles TypeScript files into JavaScript in the `dist/` directory (via `tsc`).
* `npm start` - Runs the compiled production server (`node dist/server.js`).

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
# kache_project
