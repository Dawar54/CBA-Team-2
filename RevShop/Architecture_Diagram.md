# RevShop Application Architecture

This diagram shows the modular/layered design of our scalable MERN application. The boundaries shown below easily allow for splitting out individual components into a microservices architecture in the future.

```mermaid
graph TD
    subgraph Client [Client Tier]
        Buyer[Buyer Browser]
        Seller[Seller Browser]
    end

    subgraph Frontend [React Frontend Web App]
        UI[UI Components / Pages]
        State[State Management - Redux/Context]
        Axios[API Client - Axios/Fetch]
        UI <--> State
        State <--> Axios
    end

    subgraph Backend [Node.js / Express Backend]
        Router[API Gateway / Router]
        Auth[JWT Authentication & Middleware]
        Controllers[Business Logic Controllers]
        Models[Mongoose ODM / Data Access]
        
        Router --> Auth
        Router --> Controllers
        Auth --> Controllers
        Controllers --> Models
    end

    subgraph Database [Database Tier]
        Mongo[(MongoDB)]
    end

    Buyer -->|HTTP/REST| UI
    Seller -->|HTTP/REST| UI
    
    Axios -->|JSON Req/Res| Router
    Models -->|Mongoose connection| Mongo

    classDef react fill:#61dafb,stroke:#333,stroke-width:2px,color:#000;
    classDef node fill:#339933,stroke:#333,stroke-width:2px,color:#fff;
    classDef mongo fill:#47A248,stroke:#333,stroke-width:2px,color:#fff;
    
    class Frontend react;
    class Backend node;
    class Database mongo;
```

## Layered Design Details
- **Presentation Layer (Frontend)**: React components for visual rendering.
- **Application Layer (Backend Server)**: Express server handling the HTTP requests, routing, and middleware logic such as authentication.
- **Business Logic Layer (Controllers)**: Processing core operations (e.g., placing orders, validating threshold levels, taking payments).
- **Data Access Layer (Models)**: Mongoose schemas interacting with the physical database, creating an abstraction over raw MongoDB queries. 
- **Data Layer (Database)**: The persistent MongoDB storage.
