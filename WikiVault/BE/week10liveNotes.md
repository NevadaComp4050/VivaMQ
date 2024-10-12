# Week 10 liveshare

## Refactoring
The backend is currently over specialised and has to be broken whenever the smallest thing is changed. This has to be addressed.

Solution, modules where the functionality can be composed within routes. Controller functions should treat `req.body` as a mutable environment passed from one controller to the next. Finally `req.body.final` should contain the required response data.

For an example of this see [The Unit controller](../../backend/src/modules/Unit/Unit.controller.ts). Note mutation and cookie cutting. 

### Route collisions
Currently there is an issue where routes overlap in their interpretation. The `/` routes should be extended to take a form to match with.

- Routes
  - POST    - Create
    - `/`       create
  - POST    - Read
    - unimplemented
  - GET     - Read
    - `/`       all
    - `/:id`    matches id
  - PUT     - Update
  - DELETE  - Delete
    - `/`       all
    - `/:id`    matches id

### Modules
Need to state the supported behaviour at the top of the files.

#### Routes
These are basic example routes to implement MVP behaviour. For complex requirements, DTO may be infeasible for frontend to achieve. Routes should show how the DTO is unwrapped to cause the expected behaviour.

- Each route should
  - Modify req
  - call sendFinal

#### Controller
- Needs to
  - Implement the CRUD
  - Support additional behaviour.
    - For example calling special services.
    - AI comms etc

#### Service
- Resource access
  - For CRUD
    - Create
      - Single
    - Read
      - get
      - "where"
    - Update
      - single
      - "where"
    - Delete
      - all
      - single
      - "where"