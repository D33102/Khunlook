export const swaggerOptions = {
  swagger: {
    info: {
      title: "Khunlook",
      description: "Individual Study III",
      version: "1.0.0",
    },
    host: "localhost",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [{ name: "Default", description: "Default" }],
  },
};

export const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};
