import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description:
        "User, rooms and bookings API with JWT authentication and role-based access control",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            error: { type: "string", example: "Validation failed" },
            details: { type: "object" },
          },
        },
        Message: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        Shift: {
          type: "string",
          enum: ["MORNING", "AFTERNOON", "EVENING"],
        },
        Address: {
          type: "object",
          properties: {
            id: { type: "integer" },
            street: { type: "string" },
            number: { type: "string" },
            complement: { type: "string", nullable: true },
            neighborhood: { type: "string" },
            cep: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
          },
        },
        AddressInput: {
          type: "object",
          required: [
            "street",
            "number",
            "neighborhood",
            "cep",
            "city",
            "state",
          ],
          properties: {
            street: { type: "string" },
            number: { type: "string" },
            complement: { type: "string", nullable: true },
            neighborhood: { type: "string" },
            cep: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
          },
        },
        AddressUpdateInput: {
          type: "object",
          properties: {
            street: { type: "string" },
            number: { type: "string" },
            complement: { type: "string", nullable: true },
            neighborhood: { type: "string" },
            cep: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string", nullable: true },
            cpf: { type: "string" },
            isAdmin: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            address: { $ref: "#/components/schemas/Address" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password", "cpf", "address"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            phone: { type: "string", nullable: true },
            cpf: { type: "string" },
            address: { $ref: "#/components/schemas/AddressInput" },
          },
        },
        CreateUserRequest: {
          allOf: [
            { $ref: "#/components/schemas/RegisterRequest" },
            {
              type: "object",
              properties: {
                isAdmin: { type: "boolean", default: false },
              },
            },
          ],
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            phone: { type: "string", nullable: true },
            cpf: { type: "string" },
            isAdmin: { type: "boolean" },
            address: { $ref: "#/components/schemas/AddressUpdateInput" },
          },
        },
        Room: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            capacity: { type: "integer" },
            price: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateRoomRequest: {
          type: "object",
          required: ["name", "capacity", "price"],
          properties: {
            name: { type: "string" },
            description: { type: "string", nullable: true },
            capacity: { type: "integer", minimum: 0 },
            price: { type: "number", minimum: 0 },
          },
        },
        UpdateRoomRequest: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string", nullable: true },
            capacity: { type: "integer", minimum: 0 },
            price: { type: "number", minimum: 0 },
          },
        },
        Booking: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            roomId: { type: "integer" },
            day: { type: "string", format: "date-time" },
            shift: { $ref: "#/components/schemas/Shift" },
            createdAt: { type: "string", format: "date-time" },
            room: { $ref: "#/components/schemas/Room" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        CreateBookingRequest: {
          type: "object",
          required: ["roomId", "day", "shift"],
          properties: {
            roomId: { type: "integer", example: 1 },
            day: { type: "string", example: "2026-08-15" },
            shift: { $ref: "#/components/schemas/Shift" },
          },
        },
        UpdateBookingRequest: {
          type: "object",
          properties: {
            roomId: { type: "integer" },
            day: { type: "string", example: "2026-08-15" },
            shift: { $ref: "#/components/schemas/Shift" },
          },
        },
      },
    },
  },
  apis: ["./src/docs/**/*.ts"],
};

type SwaggerOperation = {
  get(key: "method" | "path"): string;
};

function operationsSorter(a: SwaggerOperation, b: SwaggerOperation) {
  const methodOrder = ["get", "post", "put", "patch", "delete"];
  const byMethod =
    methodOrder.indexOf(a.get("method")) - methodOrder.indexOf(b.get("method"));
  if (byMethod !== 0) return byMethod;

  const pathA = a.get("path");
  const pathB = b.get("path");
  const paramA = pathA.includes("{") ? 1 : 0;
  const paramB = pathB.includes("{") ? 1 : 0;
  if (paramA !== paramB) return paramA - paramB;

  return pathA.localeCompare(pathB);
}

export const swaggerUiOptions = {
  swaggerOptions: {
    tagsSorter: "alpha" as const,
    operationsSorter,
  },
};

export default swaggerJsdoc(options);
