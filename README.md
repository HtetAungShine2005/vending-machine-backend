# Vending Machine Backend API

A robust, scalable RESTful backend for a vending machine, built with **Node.js**, **Express**, **TypeScript**, **SQLite (Prisma)**, and **Jest**.

---

## Features
- Full CRUD for chocolates (stock inventory)
- Buy chocolates (with change and cash tracking)
- View inventory and user cash
- Restock chocolates (with max quantity enforcement)
- Clean, modular architecture (controllers, services, models, routes, middleware)
- Unit tests for core business logic

---

## Tech Stack
- **Node.js** + **Express** (API server)
- **TypeScript** (type safety)
- **SQLite** (via Prisma ORM)
- **Jest** (unit testing)

---

## Setup & Installation
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run DB migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```
3. **Seed initial data:**
   ```bash
   npm run seed
   ```
4. **Start the server (dev):**
   ```bash
   npm run dev
   ```
   The server runs at `http://localhost:3000/api` by default.

---

## API Endpoints

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| GET    | `/inventory`         | Get all chocolates & user cash     |
| GET    | `/inventory/:id`     | Get a chocolate by id              |
| POST   | `/inventory`         | Create a new chocolate             |
| PUT    | `/inventory/:id`     | Update a chocolate                 |
| DELETE | `/inventory/:id`     | Delete a chocolate                 |
| POST   | `/buy`               | Buy a chocolate                    |
| POST   | `/restock`           | Restock a chocolate                |

---

### 1. GET `/inventory`
- **Description:** Returns the list of chocolates (id, name, price, quantity) and the current user cash.
- **Response Example:**
  ```json
  {
    "chocolates": [
      { "id": 1, "name": "Toblerone", "price": 5, "quantity": 10 },
      { "id": 2, "name": "Snickers Pack", "price": 8, "quantity": 10 },
      { "id": 3, "name": "Ferrero", "price": 15, "quantity": 10 }
    ],
    "userCash": 200
  }
  ```

### 2. GET `/inventory/:id`
- **Description:** Get a single chocolate by id.
- **Response Example:**
  ```json
  { "id": 1, "name": "Toblerone", "price": 5, "quantity": 10 }
  ```
- **Error Example:**
  ```json
  { "error": true, "message": "Chocolate not found", "status": 404 }
  ```

### 3. POST `/inventory`
- **Description:** Create a new chocolate. Name must be unique. Max quantity is 10. `id` is auto-assigned.
- **Request Body:**
  ```json
  { "name": "KitKat", "price": 7, "quantity": 5 }
  ```
- **Response Example:**
  ```json
  { "id": 4, "name": "KitKat", "price": 7, "quantity": 5 }
  ```
- **Error Examples:**
  - Duplicate name:
    ```json
    { "error": true, "message": "Chocolate name must be unique", "status": 400 }
    ```
  - Quantity too high:
    ```json
    { "error": true, "message": "Max quantity is 10", "status": 400 }
    ```

### 4. PUT `/inventory/:id`
- **Description:** Update a chocolate by id. Name must be unique. Max quantity is 10.
- **Request Body:**
  ```json
  { "name": "Toblerone XL", "price": 6, "quantity": 8 }
  ```
- **Response Example:**
  ```json
  { "id": 1, "name": "Toblerone XL", "price": 6, "quantity": 8 }
  ```
- **Error Examples:**
  - Not found:
    ```json
    { "error": true, "message": "Chocolate not found", "status": 404 }
    ```
  - Duplicate name:
    ```json
    { "error": true, "message": "Chocolate name must be unique", "status": 400 }
    ```
  - Quantity too high:
    ```json
    { "error": true, "message": "Max quantity is 10", "status": 400 }
    ```

### 5. DELETE `/inventory/:id`
- **Description:** Delete a chocolate by id.
- **Response Example:**
  ```json
  { "message": "Chocolate deleted successfully" }
  ```
- **Error Example:**
  ```json
  { "error": true, "message": "Chocolate not found", "status": 404 }
  ```

### 6. POST `/buy`
- **Description:** Buy a chocolate by name, inserting cash. Dispenses chocolate, returns change, and updates user cash.
- **Request Body:**
  ```json
  { "chocolateName": "Toblerone", "insertedCash": 10 }
  ```
- **Response Example:**
  ```json
  {
    "message": "Enjoy your chocolate!",
    "change": 5,
    "remainingCash": 205,
    "chocolateDispensed": "Toblerone"
  }
  ```
- **Error Examples:**
  ```json
  { "error": true, "message": "Chocolate not found", "status": 404 }
  { "error": true, "message": "Out of stock", "status": 400 }
  { "error": true, "message": "Not enough money inserted", "status": 400 }
  ```

### 7. POST `/restock`
- **Description:** Restock a chocolate by name. Cannot exceed max quantity (10).
- **Request Body:**
  ```json
  { "chocolateName": "Toblerone", "quantity": 2 }
  ```
- **Response Example:**
  ```json
  {
    "message": "Restocked successfully",
    "updatedInventory": {
      "name": "Toblerone",
      "price": 5,
      "quantity": 10
    }
  }
  ```
- **Error Examples:**
  ```json
  { "error": true, "message": "Chocolate not found", "status": 404 }
  { "error": true, "message": "Cannot restock above max quantity (10)", "status": 400 }
  ```

---

## Error Response Format
All error responses follow this format:
```json
{ "error": true, "message": "<description>", "status": <code> }
```

---

## Example Postman Collection Table

| Name                | Method | URL                | Body (JSON)                                   | Success Response Example                |
|---------------------|--------|--------------------|-----------------------------------------------|-----------------------------------------|
| Get Inventory       | GET    | /inventory         |                                               | See above                               |
| Get Chocolate By Id | GET    | /inventory/1       |                                               | See above                               |
| Create Chocolate    | POST   | /inventory         | `{ "name": "KitKat", "price": 7, "quantity": 5 }` | See above                               |
| Update Chocolate    | PUT    | /inventory/1       | `{ "name": "Toblerone XL", "price": 6, "quantity": 8 }` | See above                               |
| Delete Chocolate    | DELETE | /inventory/1       |                                               | `{ "message": "Chocolate deleted successfully" }` |
| Buy Chocolate       | POST   | /buy               | `{ "chocolateName": "Toblerone", "insertedCash": 10 }` | See above                               |
| Restock Chocolate   | POST   | /restock           | `{ "chocolateName": "Toblerone", "quantity": 2 }`      | See above                               |

---

## Project Structure
```
src/
  controllers/   # Route handlers
  routes/        # Express routers
  services/      # Business logic
  models/        # Data models, Prisma, in-memory user cash
  middleware/    # Error handling
  tests/         # Jest unit tests
```

---

## Code Process Flow

### 1. **Server Startup**
- The app starts with `npm run dev` and loads all routes, middleware, and error handlers.
- A startup banner is printed to the console.

### 2. **Request Handling**
- Every incoming HTTP request passes through:
  1. **JSON body parser** (`express.json()`)
  2. **Logging middleware**: Logs each request in the format:
     ```
     [YYYY-MM-DD/HH:mm:ss/TimeZone] [LEVEL] METHOD URL -> STATUS (DURATIONms) - "message"
     ```
     - `[INFO]` for 2xx/3xx, `[ERROR]` for 4xx/5xx, `[OTHER]` otherwise.
     - Includes the response message if present.
  3. **Route matching**: The request is routed to the appropriate controller based on the URL and method.
  4. **Controller**: Handles the request, calls the relevant service, and sends a response.
  5. **Service**: Contains business logic (e.g., buy, restock, CRUD for chocolates).
  6. **Error handler**: Any thrown errors are caught and formatted as JSON error responses.
  7. **404 handler**: If no route matches, a JSON 404 error is returned.

### 3. **Vending Process Example (Buy Chocolate)**
- **User Action:** Sends a POST `/buy` request with `{ chocolateName, insertedCash }`.
- **Backend Flow:**
  1. Route `/buy` → `buyController` → `buyService`.
  2. Service checks if the chocolate exists, is in stock, and if payment is sufficient.
  3. If valid, decrements stock, updates user cash, calculates change, and returns a success message.
  4. If any check fails, throws an error handled by the error middleware.
  5. Log output example:
     ```
     [2025-07-23/21:15:59/Asia/Yangon] [INFO] POST /buy -> 200 (12ms) - "Enjoy your chocolate!"
     [2025-07-23/21:16:01/Asia/Yangon] [ERROR] POST /buy -> 400 (8ms) - "Out of stock"
     ```

### 4. **CRUD Process Example (Inventory)**
- **Create:** `POST /inventory` → Validates input, creates chocolate, returns new record.
- **Read:** `GET /inventory` or `GET /inventory/:id` → Returns chocolates or a single chocolate.
- **Update:** `PUT /inventory/:id` → Validates, updates chocolate, returns updated record.
- **Delete:** `DELETE /inventory/:id` → Deletes chocolate, returns success message.
- All actions are logged and errors are handled consistently.

### 5. **Restock Process Example**
- **User Action:** Sends a POST `/restock` request with `{ chocolateName, quantity }`.
- **Backend Flow:**
  1. Route `/restock` → `restockController` → `restockService`.
  2. Service checks if chocolate exists and if restock would exceed max quantity.
  3. If valid, updates stock and returns updated inventory.
  4. If not, throws an error handled by the error middleware.

### 6. **Error Handling**
- All errors (validation, not found, etc.) are caught by the error handler and returned as:
  ```json
  { "error": true, "message": "<description>", "status": <code> }
  ```
- Unmatched routes return a 404 error with a clear message.
- All errors are logged as `[ERROR]` in the console.

### 7. **User Cash**
- Tracked in memory (resets on server restart).
- Updated every time a chocolate is bought.
- Included in every `GET /inventory` response.

---

## Assumptions & Notes
- User cash is tracked in-memory (resets on server restart)
- Max chocolate quantity is 10
- Only 3 chocolates are supported by default: Toblerone, Snickers Pack, Ferrero (but you can add more)
- All chocolate IDs are auto-incremented and assigned by the backend
- All error responses are JSON: `{ "error": true, "message": "...", "status": <code> }`

---

## Testing
Run all unit tests:
```bash
npm test
```

---

## License
MIT 
