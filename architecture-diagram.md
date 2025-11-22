# Architecture Evolution Diagram

```mermaid
graph TB
    subgraph "Stage 1: Just Trying Redis"
        A1[Simple Node Script] --> R1[Redis]
        style A1 fill:#f9f,stroke:#333
        style R1 fill:#ff6b6b
    end

    subgraph "Stage 2: It's Getting Real"
        A2[Hono API] --> R2[Redis]
        A2 --> P2[PostgreSQL]
        A2 --> B2[BullMQ Queue]
        style A2 fill:#51cf66
        style R2 fill:#ff6b6b
        style P2 fill:#339af0
        style B2 fill:#ffd43b
    end

    subgraph "Stage 3: Full Platform"
        W3[React Frontend] --> A3[Hono API]
        A3 --> R3[Redis Cache]
        A3 --> P3[PostgreSQL]
        A3 --> Q3[BullMQ]
        Q3 --> C3[Consumer Service]
        A3 <--> S3[Socket.io]
        W3 <--> S3
        A3 --> Auth[Better Auth]

        style W3 fill:#61dafb
        style A3 fill:#51cf66
        style R3 fill:#ff6b6b
        style P3 fill:#339af0
        style Q3 fill:#ffd43b
        style C3 fill:#ae3ec9
        style S3 fill:#f06595
        style Auth fill:#ffc078
    end
```

## Tech Stack Evolution

### Week 1: "Just Redis"
- Started with a simple experiment
- Basic key-value operations
- No database, no API

### Week 4: "Wait, I Need More"
- Added PostgreSQL for persistent data
- Hono for API framework
- BullMQ for background jobs
- Drizzle ORM for type-safe queries

### Week 8: "This is a Real Product"
- Full React frontend with TanStack Router
- Real-time updates with Socket.io
- Authentication system
- API key management
- Leaderboard system
- Background job processing
- Redis caching layer
