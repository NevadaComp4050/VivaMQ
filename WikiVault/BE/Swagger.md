# Swagger notes
Swagger is a not so simple tool for self documentation of available API routes for example [user.route](https://github.com/NevadaComp4050/VivaMQ/blob/main/backend/src/modules/users/users.route.ts) proides an example of how docs are generated.



## Checking available APIs
After starting the dev server with `npm run dev` a swagger url will be presented. For example [the swagger docs example](https://petstore.swagger.io/#/). This same page is available for the backend server, acces it by appending `/v1/swagger/` to the root. For the swagger docs example, the swagger config ([found here](../../backend/src/config/express-jsdoc-swagger.config.ts) for this Backend) is configured following [this specification](https://swagger.io/specification/v2/).
