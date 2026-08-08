const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Income Expense Tracker API",
      version: "1.0.0",
      description:
        "API documentation for the Income Expense Tracker backend.",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
    },

    tags: [
      {
        name: "Authentication",
        description: "Authentication and account management APIs",
      },
      {
        name: "Income",
        description: "Income management APIs",
      },
      {
        name: "Expense",
        description: "Expense management APIs",
      },
      {
        name: "Dashboard",
        description: "Dashboard statistics APIs",
      },
    ],
  },

  apis: [
    "./routes/*.js",
    "./controllers/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;