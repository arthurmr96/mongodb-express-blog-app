// src/swagger.js
const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blogging App API",
      version: "1.0.0",
      description: "REST API for the final recommended schema (posts, users, comments). See article and examples/10-final-schema.",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [path.join(__dirname, "routes/api/*.js")],
};

module.exports = swaggerJSDoc(options);