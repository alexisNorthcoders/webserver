# Webserver README

This is a simple web server built using Express.js. It serves static files for two games, Snake and Zigzag, and provides endpoints to get and add scores for the Snake game.

This server also uses Redis for storing scores and WebSockets for real-time communication.

### Redis Integration

The server uses Redis to store and retrieve scores for the Snake game. The Redis client is configured to connect to a local Redis server running on `127.0.0.1:6379`.

### WebSocket Integration

The server uses WebSockets to handle real-time communication for the games. When a player connects, their movement and other actions are broadcast to all connected clients.

### Redis Functions

- `addScore(userId, score)`: Adds a score for a specific user.
- `getScore(userId)`: Retrieves scores for a specific user.
- `deleteAllScores()`: Deletes all user scores.

### WebSocket Events

- `connection`: Triggered when a new client connects.
- `playerMovement`: Handles player movement data.
- `newPlayer`: Registers a new player.
- `disconnect`: Handles client disconnection.

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd Projects/webserver
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the server:
    ```sh
    node index.js
    ```
2. The server will be running on `http://localhost:3000`.

## Endpoints

### Static Files

- `/snake`: Serves static files for the Snake game.
- `/zigzag`: Serves static files for the Zigzag game.

### API

- `GET /snake/score/:userId`: Retrieves the score for a specific user.
- `POST /snake/score/:userId`: Adds a score for a specific user. The request body must include a `score` field.

## Example Requests

### Get Score

```sh
curl http://localhost:3000/snake/score/123
```

### Add Score

```sh
curl -X POST http://localhost:3000/snake/score/123 -H "Content-Type: application/json" -d '{"score": 100}'
```

## Middleware

- Logs the HTTP method, URL, and request body for each request.

## License

This project is licensed under the MIT License.