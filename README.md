# AzuraTest Backend 🚀

This repository contains the backend service for **AzuraTest**. It is built using **Node.js** and **TypeScript**, heavily utilizing **Docker** for containerization and easy deployment. The project also includes a structured database migration system.

## 🛠 Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Dev Tools:** [Nodemon](https://nodemon.io/) (for live-reloading)
* **Containerization:** [Docker](https://www.docker.com/) & Docker Compose
* **Database Management:** SQL/NoSQL (Managed via the `migrations/` directory)

## 📦 Project Structure

```text
azuratest-be/
├── migrations/          # Database migration scripts
├── src/                 # Main TypeScript source code (Controllers, Routes, Services)
├── .dockerignore        # Files excluded from the Docker build context
├── .gitignore           # Files excluded from version control
├── docker-compose.yml   # Multi-container Docker configuration
├── Dockerfile           # Instructions to build the backend Docker image
├── entrypoint.sh        # Shell script executed upon container startup
├── nodemon.json         # Configuration for Nodemon (hot-reloading)
├── package.json         # Project dependencies and NPM scripts
├── package-lock.json    # Dependency lockfile
└── tsconfig.json        # TypeScript compiler configuration
```

## ⚙️ Prerequisites
Before you begin, ensure you have the following installed on your local machine:

Node.js (v16.x or higher recommended)

npm or yarn

Docker & Docker Compose

## 🚀 Setup & Configuration Tutorial
Option 1: Running via Docker (Recommended)
Because this project comes with a docker-compose.yml and a Dockerfile, running it via Docker is the easiest way to ensure consistency across environments.

Clone the repository:

Bash
git clone [https://github.com/admalfrizi/azuratest-be.git](https://github.com/admalfrizi/azuratest-be.git)
cd azuratest-be
Configure Environment Variables:
Create a .env file in the root directory. You will likely need database credentials and port configurations. (Check docker-compose.yml for required environment variables).

Bash
touch .env
# Add your environment variables inside .env
Build and spin up the containers:

Bash
docker-compose up --build
Note: The entrypoint.sh script will automatically run upon startup, which may handle database migrations or seed logic before starting the server.

Stopping the containers:

Bash
docker-compose down
Option 2: Running Locally (Without Docker)
If you prefer developing without Docker, you can run the app directly on your host machine.

Install dependencies:

Bash
npm install
Run database migrations:
Depending on the ORM or query builder used in the migrations folder (e.g., Prisma, TypeORM, Knex), run the appropriate migration command. For example:

Bash
npm run migrate
Start the development server:
The project is configured with nodemon.json for hot-reloading. You can start the app in development mode by running:

Bash
npm run dev
Alternatively, to build and run for production:

Bash
npm run build
npm start
🗄 Migrations
Database schema changes are tracked in the migrations/ folder. Whenever you pull new changes, ensure your local database is up-to-date. If running via Docker, entrypoint.sh is typically configured to run these migrations automatically. If running locally, consult the package.json scripts for the exact migration execution command.
