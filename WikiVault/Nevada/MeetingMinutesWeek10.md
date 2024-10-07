Attendees
- Deb
- Adrian
- Aaron
- Ben
- Ivan


- Drawing a system diagram
```mermaid
flowchart
    subgraph VIVAMQ [VIVA MQ]
        FE
        BE
        AI
    end

    
    linuxInstance

    %% Use GitHub actions to push to production
    VIVAMQ -- Git Actions ----> linuxInstance
    
    %% Hosted on digital ocean
    RabbitMQ
    
    %% SupaBase
    DB
    
    %% UploadThing
    FS
    
    %% MQ funded API key
    OAI

    FE <--API--> BE 
    AI <--Push/Pop--> RabbitMQ
    BE <-- db Schema --> DB
    BE <-- Files --> FS
    BE <-- Push/Pop --> RabbitMQ
    AI <-- Inferences --> OAI
    
```

- We are getting an azure key
- SupaBase
    - Should take 5min
    - Yields a URL
- UploadThing
    - S3 instance
- Adrian: lack of time
    - Can give one full day
    - Agreed to keep track of progress

Action Items
- Ivan: SupaBase
    - Get a URL
- Ben: API Routes
    - Get them to match the MVP demoed in week 8
- Deb: Jest testing walkthrough
    - Next week
