# ConnectMe architecture

This document describes the source layout and the two main runtime paths: authenticated HTTP requests and real-time chat events.

## Component diagram

```mermaid
flowchart TB
    Browser["Browser"]
    subgraph Client["React client (Create React App)"]
        Pages["Pages and reusable components"]
        Router["React Router"]
        Redux["Redux Toolkit + redux-persist"]
        Context["Chat Context API"]
        SocketClient["Socket.IO client"]
        Pages --> Router
        Pages --> Redux
        Pages --> Context
        Pages --> SocketClient
    end

    subgraph Server["Node.js / Express process"]
        Express["Express REST API"]
        Jwt["JWT verification middleware"]
        Multer["Multer disk storage"]
        Assets["Static /assets route"]
        SocketServer["Socket.IO server"]
        Models["Mongoose models"]
        Express --> Jwt
        Express --> Multer
        Express --> Models
        SocketServer --> Models
    end

    Mongo[("MongoDB")]
    Files[("server/public/assets")]

    Browser --> Pages
    Router <-->|HTTP + JSON / multipart| Express
    SocketClient <-->|Socket.IO events| SocketServer
    Models <-->|Mongoose queries| Mongo
    Multer --> Files
    Assets --> Files
```

## Main responsibilities

| Component | Responsibility |
|---|---|
| React pages/components | Login, feed, profile, saved posts, chat, forms, and reusable UI |
| Redux Toolkit | Login state, user, JWT, theme mode, and feed posts |
| redux-persist | Persists the Redux store in browser storage |
| Chat Context | Selected chat, chat list, user and in-session notification state |
| Express routes/controllers | Exposes authentication, user, post, chat, message, and saved-post operations |
| JWT middleware | Verifies bearer tokens on protected HTTP routes |
| Mongoose | Maps user, post, saved-post, chat, and message documents to MongoDB |
| Multer | Receives multipart image uploads and writes them to disk |
| Static assets route | Serves local images from `/assets` |
| Socket.IO | Joins user/chat rooms and relays typing and message events |

## HTTP authentication and request flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant React as React client
    participant API as Express API
    participant JWT as JWT middleware
    participant DB as MongoDB

    User->>React: Submit login credentials
    React->>API: POST /auth/login
    API->>DB: Find user by email
    DB-->>API: User record
    API->>API: bcrypt.compare(password, hash)
    API-->>React: User data + signed JWT
    React->>React: Store auth state via Redux
    User->>React: Request a protected feature
    React->>API: HTTP request + Bearer token
    API->>JWT: Verify JWT
    JWT-->>API: req.user identity
    API->>DB: Execute controller query/update
    DB-->>API: Result
    API-->>React: JSON response
```

The current implementation signs JWTs without an explicit expiry. Also, some controllers still trust IDs supplied in request bodies or URL parameters rather than enforcing that the target resource belongs to the authenticated user. See the security section in the root README.

## Real-time messaging flow

```mermaid
sequenceDiagram
    autonumber
    participant A as Sender client
    participant API as Express API
    participant DB as MongoDB
    participant IO as Socket.IO server
    participant B as Recipient client

    A->>IO: setup(user data)
    IO-->>A: connected
    A->>IO: join chat(chatId)
    B->>IO: setup(user data)
    B->>IO: join chat(chatId)
    A->>API: POST /message { content, chatId }
    API->>DB: Create Message and update Chat.latestMessage
    DB-->>API: Persisted message
    API-->>A: Message document
    A->>IO: new message(message)
    IO-->>B: message recieved(message)
    A->>IO: typing / stop typing
    IO-->>B: typing / stop typing
```

The message is written through the REST API first. Socket.IO then relays the newly persisted message to recipient user rooms. The current socket connection does not authenticate the handshake; this must be addressed before deployment.

## Data model overview

- **User:** name, email, password hash, profile image path, friends, location, occupation, and placeholder profile metrics.
- **Post:** author identifiers/name, text, image path, likes map, and timestamps.
- **Saved:** user ID, post reference, category, and timestamps.
- **Chat:** members, group/direct-chat flag, latest message, optional group name/admin.
- **Message:** sender, content, chat reference, read-by list, and timestamps.

The comments field on `Post` is declared as an array of ObjectId references, but the unfinished comment controller constructs embedded comment objects. The comments feature needs a consistent data model before it is enabled.

## Runtime ports and configuration

- React development server: `http://localhost:3000`.
- Express and Socket.IO: `http://localhost:3001` when using the supplied `.env.example`.
- MongoDB: configured through `MONGO_URL`.
- JWT signing/verification: configured through `JWT_SECRET`.

The frontend currently hardcodes the backend origin in multiple components. Centralizing it in environment-based configuration is a roadmap item.
