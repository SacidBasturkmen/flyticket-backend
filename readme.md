# FlyTicket Backend

FlyTicket’s backend is built with Node.js, Express, PostgreSQL, Sequelize (ORM) and JWT. It exposes REST API endpoints to manage administrators, cities, flights and tickets.

## Table of Contents

1. [Technologies](#technologies)
2. [Prerequisites](#prerequisites)
3. [Setup & Installation](#setup--installation)
4. [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [Database Models](#database-models)
7. [API Routes](#api-routes)
8. [.gitignore](#gitignore)
9. [Contributing](#contributing)
10. [License](#license)

## Technologies

* Node.js
* Express
* PostgreSQL
* Sequelize
* bcrypt
* jsonwebtoken
* dotenv
* express-async-handler

## Prerequisites

* Node.js (v16+)
* PostgreSQL
* Git

## Setup & Installation

```bash
git clone <repository-url>
cd backend
npm install
```

Create PostgreSQL database:

```sql
CREATE DATABASE flyticket;
```

Create a `.env` file:

```env
DB_NAME=flyticket
DB_USER=postgres
DB_PASSWORD=1234
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
PORT=5252
```

Run the server:

```bash
npm run dev
```

## Environment Variables

* `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`: PostgreSQL config
* `JWT_SECRET`: Token secret
* `PORT`: Server port

## Project Structure

```
backend/
├─ app.js
├─ data/
│  └─ db.js
├─ features/
│  ├─ admin/
│  ├─ city/
│  ├─ flight/
│  └─ ticket/
├─ middleware/
├─ models/
├─ .env
└─ package.json
```

## Database Models

### Admin

* `id` (PK)
* `username` (unique)
* `password` (hashed)

### City

* `city_id` (PK)
* `city_name`

### Flight

* `flight_id` (PK)
* `from_city_id`, `to_city_id` (FK → City)
* `departure_time`, `arrival_time`
* `price`, `seats_total`, `seats_available`

### Ticket

* `ticket_id` (PK)
* `passenger_name`, `passenger_surname`, `passenger_email`
* `flight_id` (FK → Flight)
* `seat_number` (optional)

### Associations

```js
City.hasMany(Flight, { foreignKey: "from_city_id" });
City.hasMany(Flight, { foreignKey: "to_city_id" });
Flight.belongsTo(City, { foreignKey: "from_city_id" });
Flight.belongsTo(City, { foreignKey: "to_city_id" });
Flight.hasMany(Ticket, { foreignKey: "flight_id" });
Ticket.belongsTo(Flight, { foreignKey: "flight_id" });
```

## API Routes

### Admin

| Method | Route               | Access | Description                  |
| ------ | ------------------- | ------ | ---------------------------- |
| POST   | /api/admin/register | Public | Register admin (returns JWT) |
| POST   | /api/admin/login    | Public | Login admin (returns JWT)    |

### City

| Method | Route          | Access     | Description       |
| ------ | -------------- | ---------- | ----------------- |
| GET    | /api/city      | Public     | List all cities   |
| GET    | /api/city/\:id | Public     | Get city by ID    |
| POST   | /api/city      | Admin-only | Create a new city |
| PUT    | /api/city/\:id | Admin-only | Update city by ID |
| DELETE | /api/city/\:id | Admin-only | Delete city by ID |

### Flight

| Method | Route            | Access     | Description         |
| ------ | ---------------- | ---------- | ------------------- |
| GET    | /api/flight      | Public     | List all flights    |
| GET    | /api/flight/\:id | Public     | Get flight by ID    |
| POST   | /api/flight      | Admin-only | Create a new flight |
| PUT    | /api/flight/\:id | Admin-only | Update flight by ID |
| DELETE | /api/flight/\:id | Admin-only | Delete flight by ID |

### Ticket

| Method | Route               | Access     | Description                    |
| ------ | ------------------- | ---------- | ------------------------------ |
| GET    | /api/ticket         | Admin-only | List all tickets               |
| GET    | /api/ticket/\:email | Public     | Get tickets by passenger email |
| POST   | /api/ticket         | Public     | Book a ticket                  |

## .gitignore

```gitignore
node_modules/
logs/
*.log
pids/
*.pid
coverage/
.npm
.env
package-lock.json
.vscode/
.idea/
.DS_Store
Thumbs.db
```

## Contributing

```bash
git checkout -b feature/your-feature-name
git commit -m "Add feature"
git push origin feature/your-feature-name
```

Then open a pull request.

## License

MIT
