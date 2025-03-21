export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Account service API",
      version: "1.0.0",
      description: "API endpoints for a Account service",
      contact: {
        name: "geozi",
        url: "https://github.com/geozi/nodejs-typescript-book-review",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local server",
        },
      ],
    },
  },
  apis: ["./src/routes/*.ts"],
};
