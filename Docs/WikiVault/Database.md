# Database notes

## [Prisma](https://www.prisma.io/) notes
Dev requested that this be implemented for this project.

### Description
Node.js and TypeScript [ORM](ORM.md)


### Usage
These are the files that must be changed in order to present an API recognisable by [Swagger](Swagger.md)
```mermaid
---
title: Prisma to API
---
graph
sch[<a href=https://github.com/NevadaComp4050/VivaMQ/blob/main/backend/prisma/schema.prisma>Schema</a>]
serv[<a href=https://github.com/NevadaComp4050/VivaMQ/blob/main/backend/src/modules/users/users.service.ts>Service</a>]
cont[<a href='https://github.com/NevadaComp4050/VivaMQ/blob/main/backend/src/modules/users/users.controller.ts'>Controller</a>]
html[<a href=https://github.com/NevadaComp4050/VivaMQ/blob/main/backend/src/modules/users/users.route.ts>/route</a>]
sch --Prisma driver--> serv
serv --Used by--> cont
cont --Called by--> html
```

### Dependencies
